<?php
class LoginController
{

  static public function apiPostLogin() {
  	error_log("enter apiPostLogin");
  	  	
    $email = $_POST['email'];
    $password = $_POST['password'];

    $user = getDatabase()->one('SELECT id, username, email FROM users WHERE email=:email AND password = sha(concat(:password, salt))', 
      array('email' => $email, 'password' => $password));

    if ( !$user || ! array_key_exists('username', $user) ) {
      return LoginController::apiUnauthenticatedStatus();
    }
    
      getSession()->set(Constants::USERNAME, $user['username']);
      $user = UserController::getLoggedInUser();
      $user->fetchGames();
      $user->newGames = GameController::apiNewGames();
      
  	  error_log("exit apiPostLogin");
      return $user;
  }

  static public function getUserId() {
    $username = self::getUsername();
    $row = getDatabase()->one('select id from users where username = :username', 
      array('username' => $username));
    $user_id = $row['id'];
    return $user_id;
  }

  /* Get the logged in user from Session */
  static public function apiGetLogin() {
    $user = UserController::getLoggedInUser();
    if ( $user === null ) {
      return self::apiUnauthenticatedStatus("Please log in");
    }

    $user->setDebug();
	$user->fetchGames();
    $user->newGames = GameController::apiNewGames();
    return $user;
  }

  static public function getUsername() {
    $username = getSession()->get(Constants::USERNAME);
    if ( $username === null ) {
      return self::apiUnauthenticatedStatus("Please log in");
    }
    return $username;
  }

  static public function processLogout() {
    getSession()->set(Constants::USERNAME, null);
    return "You have been logged out";
  }
  
  static public function forgotPassword() {
  	$email = $_POST['email'];
  	$row = getDatabase()->one('select id, username, email from users where email = :email', array('email' => $email));
  	$user = new User($row);
  	
  	if ( !$user || ! array_key_exists('username', $user) ) {
  		return LoginController::apiUnauthenticatedStatus();
  	}
  	
  	$token = LoginController::createTokenForUser($user);
  	
  	LoginController::sendPasswordResetEmail($user, $token);

  	return "Check your email for further instructions on resetting your password";
  }
  
  private function createTokenForUser($user) {
  	LoginController::deleteTokenForUser($user);
  	
  	$token_string = substr(base64_encode(crypt('', '')), 0, 32);
  	$users_id = $user->id;
  	$query = 'INSERT INTO token (token_string, users_id) values (:token_string, :users_id)';
  	$params = array(
  			'token_string' => $token_string,
  			'users_id' => $users_id);
  	
  	log_query($query,$params,"createTokenForUser");
  	
  	$result = getDatabase()->execute($query, $params);
  	return $token_string;
  }
  
  private function deleteTokenForUser($user) {
  	$users_id = $user->id;
  	$query = 'DELETE FROM token WHERE users_id = :users_id';
  	$params = array('users_id' => $users_id);
  	 
  	log_query($query,$params,"deleteTokenForUser");
  	 
  	$result = getDatabase()->execute($query, $params);
  	return $result;
  }
  
  private function sendPasswordResetEmail($user, $token) {
  	$headers = "From:" . getConfig()->get('mail_from');
  	$to = $user->email;
  	$subject = "INVESTR GAME: Reset Password Request";
  	$message = "Someone has requested a new password for your account at Investr Game. " .
  		"If this was not you please disregard this message. Follow this link to create a new password http://" . 
  			$_SERVER['HTTP_HOST'] . 
  			"/investr-game/pwreset.html?token=" . $token;
  	mail($to, $subject, $message, $headers);
  }

  private function fetchUserForTokenString($token_string) {
    $query = 'SELECT u.id, u.email FROM token t join users u on t.users_id = u.id WHERE token_string = :token_string';
    $params = array('token_string' => $token_string);
    $result = getDatabase()->one($query, $params);
    $user = new User($result);
    error_log("USER FOR PW RESET: " . print_r($user, true));
    return $user;
  }
    
  static public function getPasswordReset() {
    $token_string = $_GET['token'];
    $user = LoginController::fetchUserForTokenString($token_string);
    if ($user) {
	    return $user;
    } else {
   	    http_response_code(Constants::HTTP_STATUS_UNAUTHORIZED);
	    return "Invalid token";
	}
  }
  
  static public function postPasswordReset() {
  	$token_string = $_POST['token'];
  	$user = LoginController::fetchUserForTokenString($token_string);
    if (!$user) {
   	    http_response_code(Constants::HTTP_STATUS_UNAUTHORIZED);
	    return "Invalid token";
	}
  	
  	$password = $_POST['password'];
  	$confirm_password = $_POST['confirm-password'];  	
  	if($password != $confirm_password) {
	  error_log("PW: " . $password . "; PW2: " . $confirm-password);
  	  http_response_code(500);
  	  return "Password and confirmation do not match";
  	}
  	
  	$salt = time();
  	$query = "UPDATE users SET " . 
  		" salt = :salt, " .
  		" password = sha(concat(:password, :salt)) " .
  		" WHERE id = :id";
  	$params = array(salt => $salt, password => $password, id => $user->id);
  	
  	log_query($query,$params,"updatePasswordForUser");
  	
  	$result = getDatabase()->execute($query, $params);
  	
  	if(!$result) {
  		error_log("PW NOT UPDATED");
   	    http_response_code(500);
	    return "Password not updated";  		
  	}
  	
  	$result = LoginController::deleteTokenForUser($user);
  	
  }

  static public function apiUnauthenticatedStatus($message = "Login failed") {
    http_response_code(Constants::HTTP_STATUS_UNAUTHORIZED);
    return $message;
  } 

  static public function apiNotAuthorizedStatus($message = "You do have permission to view that resource") {
    http_response_code(Constants::HTTP_STATUS_UNAUTHORIZED);
    return $message;
  } 
  

}
