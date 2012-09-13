<?php
class Order {
    const TABLENAME = "txn_order";

    public $id;
    public $user_id;
    public $game_id;
    public $year;
    public $action;
    public $security_symbol;
    public $shares;
    public $margin = 0;
    public $comment;


    public function __construct($order = array()) {
        //print_r($order['security']);
        $this->id = $order['id'];
        $this->user_id = $order['user_id'];
        $this->game_id = $order['game_id'];
        $this->year = $order['year'];
        $this->action = $order['action'];
        $this->security_symbol = $order['security_symbol'];
        $this->shares = $order['shares'];
        if ( $order['margin'] == null) {
            $this->margin = 0;
        } else {
            $this->margin = $order['margin'];
        }
        $this->comment = $order['comment'];
    }

    public function save() {
        //print_r($this);
        $query = "INSERT INTO " . self::TABLENAME .
            " (user_id, game_id, year, action, security_symbol, shares, margin, comment) " .
            " values (:user_id, :game_id, :year, :action, :security_symbol, :shares, :margin, :comment)";
        $result = getDatabase()->execute($query, array(user_id => $this->user_id,
            game_id => $this->game_id,
            year => $this->year,
            action => $this->action,
            security_symbol => $this->security_symbol,
            shares => $this->shares,
            margin => $this->margin,
            comment => $this->comment));
        return $result;
    }

}