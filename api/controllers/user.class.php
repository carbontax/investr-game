<?php
class UserController {
	public static function getLoggedInUser() {
		$user = null;
		$username = getSession()->get(Constants::USERNAME);
		if ( $username != null ) {
			$u = getDatabase()->one('SELECT * FROM users WHERE username=:username', array('username' => $username));
			$user = new User($u);
		}
		return $user;
	}

	public static function findUserByEmail($email = null) {
		$user = getDatabase()->one('SELECT * FROM users WHERE email=:email', array('email' => $email));
	}

	public static function apiUsers() {
		$user_id = LoginController::getUserId();
		$query = 'select id, username from ' . User::TABLENAME . ' where id <> :user_id';
		$rows = getDatabase()->all($query, array('user_id' => $user_id));
		return $rows;
	}

	public static function apiPollUser() {
		$user = self::getLoggedInUser();
    error_log("USER: " . $user);
		if ( $user === null ) {
			return LoginController::apiUnauthenticatedStatus("Please log in");
		} else {
			$user->setDebug();
			$gamestate = $_POST['gs'];
			error_log("apiPollUser: GAMESTATE=" . $gamestate);
			$match = $user->matchGameState($gamestate);
			if ( ! $match ) {
        // there has been a change. Return data.
				return $user;
			}
		}
	}
}
