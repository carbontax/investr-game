<?php 
class AdminController {
	public static function index() {
		$user = UserController::getLoggedInUser();
		if ( ! $user->isAdmin() ) {
			error_log("ACCESS DENIED");
			http_response_code(401);
			return;
		}
		echo "<H1>Hello " . $user->username . "</H1>";
	}
}