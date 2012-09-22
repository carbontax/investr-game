<?php

class User {
	const TABLENAME = "users";
	
    public $id;
    public $username;
    public $email;
    public $activeGames;
    public $newGames;

    public function __construct($user = array()) {
        $this->id = $user['id'];
        $this->username = $user['username'];
        $this->email = $user['email'];

//        $this->activeGames = GameController::apiActiveGames();
//        $this->newGames = GameController::apiNewGames();
    }

	public function isAdmin() {
		$query = "select 1 from user_role ur join role r on ur.role_id = r.id where r.role like 'admin' and ur.user_id = :user_id";
		$params = array(user_id => $this->id);
		//log_query($query, $params);
		$row = getDatabase()->one($query, $params);
		return count($row) > 0;
	}
}