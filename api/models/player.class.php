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
    public $turn = 0;

/*    public function __construct($player = array()) {
        $this->user_id = $player['id'];
        $this->username = $player['username'];
        $this->balance = $player['balance'];
        if ( array_key_exists('portfolio', $player) ) {
            $this->portfolio = $player['portfolio'];
        }
        if ( array_key_exists('transactions', $player) ) {
            $this->transactions = $player['transactions'];
        }
        if ( array_key_exists('orders', $player) ) {
            $this->orders = $player['orders'];
        }
        if ( array_key_exists('turn', $player) ) {
            $this->turn = $player['turn'];
        }
    }
*/  
    public function __construct($user_id, $game_id, $balance = null, $turn = 0) {
        $this->user_id = $user_id;
        $this->game_id = $game_id;
        $this->balance = $balance;
    }

    public static function withRow($row = array()) {
        $instance = new self($row['user_id'], $row['game_id'], $row['balance']);
        return $instance;
    }

    public function save() {
        $query = "INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id) values (:user_id, :game_id)";

        $result = getDatabase()->execute($query, array(user_id => $this->user_id, 
            game_id => $this->game_id));
    }

    public function fetchTransactions() {
        $query = "SELECT t.*, s.symbol as security_symbol FROM " . Transaction::TABLENAME . " t " . 
            " JOIN " . Security::TABLENAME . " s ON t.security_id = s.id " .
            " WHERE t.user_id = :user_id and t.game_id = :game_id order by t.id";

        $result = getDatabase()->all($query, array(user_id => $this->user_id, game_id => $this->game_id));
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

}