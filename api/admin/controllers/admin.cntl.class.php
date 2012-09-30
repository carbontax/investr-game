<?php 
class AdminController {
	public static function getAdminDir() {
		$admin_dir = 	dirname(parse_url($_SERVER['PHP_SELF'], PHP_URL_PATH));
		error_log("ADMIN DIR: " . $admin_dir );
		return $admin_dir;
	}

	public static function printHeader() {
		header('Content-type: text/html; charset=utf-8');
		echo "<!DOCTYPE html>\n";
	}
	
	public static function home() {
		try {
			self::checkPermissions();
		} catch (Exception $e) {
			return $e->getMessage();
		}
		
		$username = getSession()->get(Constants::USERNAME);
		self::printHeader();
		echo "<H3>Hello " . $username . "</H3>";
		self::printMenu();
	}
	
	public static function printMenu($path = "") {
		echo "<p><ul>" . PHP_EOL;
		echo "<li><a href='" . $path . "games'>GAMES</a></li>" . PHP_EOL;
		echo "<li><a href='" . $path. "users'>USERS</a></li>" . PHP_EOL;
		echo "</ul>" . PHP_EOL;
	}
	
	public static function checkPermissions() {
		$user = UserController::getLoggedInUser(getSession()->get(Constants::USERNAME));
		if ( ! $user || ! $user->isAdmin() ) {
			http_response_code(401);
			throw new Exception("Admin users only.");
		}
		return $user;
	}
}