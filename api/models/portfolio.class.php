<?php
class Portfolio {
    const TABLENAME = "portfolio";

    public $id;
    public $game_id;
    public $user_id;
    public $security_id;
    public $shares;

    public function __construct($portfolio = array()) {
        $this->id = $portfolio['id'];
        $this->game_id = $portfolio['game_id'];
        $this->user_id = $portfolio['user_id'];
        $this->security_id = $portfolio['security_id'];
        $this->shares = $portfolio['shares'];
        $this->security_symbol = $portfolio['security_symbol'];
    }

    public function save() {
        $query = "INSERT INTO " . self::TABLENAME . 
            " (game_id, user_id, security_id, shares) " .
            " values (:game_id, :user_id, :security_id, :shares)";
        $result = getDatabase()->execute($query, array(game_id => $this->game_id, 
            user_id => $this->user_id, 
            security_id => $this->security_id, 
            shares => $this->shares));
    }

}