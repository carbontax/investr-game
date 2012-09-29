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
      return LoginController::apiUnauthorizedStatus();
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
      return LoginController::apiUnauthorizedStatus("Please log in");
    }

    $user->setDebug();
	$user->fetchGames();
    $user->newGames = GameController::apiNewGames();
    return $user;
  }

  static public function getUsername() {
    $username = getSession()->get(Constants::USERNAME);
    if ( $username === null ) {
      return LoginController::apiUnauthorizedStatus("Please log in");
    }
    return $username;
  }

  static public function processLogout() {
    getSession()->set(Constants::USERNAME, null);
    return "You have been logged out";
  }

  static public function apiUnauthorizedStatus($message = "Login failed") {
    http_response_code(Constants::HTTP_STATUS_UNAUTHORIZED);
    return $message;
  } 

}
