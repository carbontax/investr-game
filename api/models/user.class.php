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

        $this->activeGames = GameController::apiActiveGames();
        $this->newGames = GameController::apiNewGames();
    }


}