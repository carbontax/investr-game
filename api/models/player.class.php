<?php
class Player {
    const TABLENAME = "player";

    public $user_id;
    public $game_id;

    public $username;
    public $balance;

    public $portfolio = array();
    public $transactions = array();
    public $orders = array();
    public $portf_worth;
    public $has_ordered = 0;
    public $rank;

    public function __construct($player = array()) {
//    	error_log("Create player with " . print_r($player, true));
    	$this->user_id = $player['user_id'];
        $this->game_id = $player['game_id'];
        $this->username = $player['username'];
	    $this->balance = $player['balance'];
	    $this->portf_worth = $player['portf_worth'];
	    $this->has_ordered = $player['has_ordered'];
	    $this->rank = $player['rank'];
    }

 /*   public static function withRow($row = array()) {
    	error_log("WITH ROW: " . print_r($row, true));
        $instance = new self($row['user_id'], $row['game_id'], $row['balance']);
        return $instance;
    } */

    public function save() {
        $query = "INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, balance) values (:user_id, :game_id, :balance)";

        $result = getDatabase()->execute($query, array(user_id => $this->user_id, 
            game_id => $this->game_id, balance => $this->balance));
    }

    public function fetchTransactions() {
        $query = "SELECT t.*, s.symbol as security_symbol FROM " . Transaction::TABLENAME . " t " . 
            " JOIN " . Security::TABLENAME . " s ON t.security_id = s.id " .
            " WHERE t.user_id = :user_id and t.game_id = :game_id order by t.id";
        $params = array(user_id => $this->user_id, game_id => $this->game_id);
		error_log("FETCH TXNS FOR PLAYER");
		error_log($query);
		error_log(print_r($params, true));
		$result = getDatabase()->all($query, $params);
        foreach ($result as $key => $row) {
            array_push($this->transactions, new Transaction($row));
        }
    }

    public function fetchPortfolio() {
        $query = "SELECT p.*, s.symbol as security_symbol FROM " . Portfolio::TABLENAME . " p " .
            " JOIN " . Security::TABLENAME . " s ON p.security_id = s.id " .
            " WHERE game_id = :game_id and user_id = :user_id";
        $result = getDatabase()->all($query, array(game_id => $this->game_id, user_id => $this->user_id));
        foreach ($result as $key => $row) {
            array_push($this->portfolio, new Portfolio($row));
        }
    }

    public function fetchOrdersForYear($year) {
        $query = "SELECT * FROM " . Order::TABLENAME . 
            " WHERE user_id = :user_id " . 
            " AND game_id = :game_id " .
            " AND year = :year " .
            " order by id";

        $result = getDatabase()->all($query, array(user_id => $this->user_id, 
            game_id => $this->game_id,
            year => $year));
        foreach ($result as $key => $row) {
            array_push($this->orders, new Order($row));
        }
    }

    public function hasOrdered($year) {
        $query = "select * from " . Order::TABLENAME . 
            " WHERE game_id = :game_id AND user_id = :user_id AND year = :year";
        $rows = getDatabase()->all($query, array(game_id => $this->game_id, 
            user_id => $this->user_id,
            year => $year));
        if ( $rows ) {
            return true;
        }
        return false;
    }
    
    public function update() {
    	$query = "update " . self::TABLENAME . " set balance = :balance where user_id = :user_id and game_id = :game_id ";
    	$params = array(balance => $this->balance, user_id => $user_id, game_id => $game_id);
    	$result = getDatabase()->execute($query, $params);
    	return $result;
    }
    
}