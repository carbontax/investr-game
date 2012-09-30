<?php 
class AdminUserController {
	public static function getUsers() {
		AdminController::printHeader();
		$users = self::fetchAllUsers();
		error_log("USERS: " . print_r($users, true));
		getTemplate()->display('admin.user.tmpl.php', array('users' => $users));
	}
	
	public static function fetchAllUsers() {
		error_log("AdminUserController::fetchAllUsers() enter");
		$users = array();
		
		$query = "SELECT * from " . User::TABLENAME;
		error_log($query);
		$rows = getDatabase()->all($query);
		foreach ($rows as $row) {
			array_push($users, new User($row));
		}
		error_log("AdminUserController::fetchAllUsers() exit");
		return $users;
	}
}