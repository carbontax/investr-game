<?php
class Transaction {
    const TABLENAME = "txn";

    public $id;
    public $user_id;
    public $game_id;
    public $year;
    public $security_id;
    public $shares;
    public $price;
    public $income;
    public $margin;
    public $margin_charge;
    public $amount;
    public $comment;

    public function __construct($txn = array()) {
        $this->id = $txn['id'];
        $this->user_id = $txn['user_id'];
        $this->game_id = $txn['game_id'];
        $this->year = $txn['year'];
        $this->security_id = $txn['security_id'];
        $this->security_symbol = $txn['security_symbol'];
        $this->shares = $txn['shares'];
        $this->price = $txn['price'];
        $this->income = $txn['income'];
        $this->margin = $txn['margin'];
        $this->margin_charge = $txn['margin_charge'];
        $this->amount = $txn['amount'];
        $this->balance = $txn['balance'];
        $this->comment = $txn['comment'];
    }

    public function saveBuy($portfolio_id = null) {
        $params = array(user_id => $this->user_id, 
            game_id => $this->game_id, 
            year => $this->year, 
            security_id => $this->security_id, 
            shares => $this->shares, 
            price => $this->price, 
            income => $this->income, 
            margin => $this->margin, 
            margin_charge => $this->margin_charge, 
            amount => $this->amount,
            balance => $this->balance,
            comment => $this->comment);

        getDatabase()->execute("START TRANSACTION");
        
        $query = " INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, year, security_id, shares, " . 
            " price, income, margin, margin_charge, amount, balance, comment) " .
            " values (:user_id, :game_id, :year, :security_id, :shares, " . 
            " :price, :income, :margin, :margin_charge, :amount, :balance, :comment)";
        error_log("TXN INSERT: " . $query);
        getDatabase()->execute($query, $params);

        $portfolio_params = array();
        if ( $portfolio_id == null ) {
            $query = " INSERT INTO " . Portfolio::TABLENAME . 
                " (game_id, user_id, security_id, shares) " . 
                " values (:game_id, :user_id, :security_id, :shares)";
            $portfolio_params = array(
                    game_id => $this->game_id, 
	            	user_id => $this->user_id,
	                security_id => $this->security_id, 
	            	shares => $this->shares);
        } else {
        	$query = " UPDATE " . Portfolio::TABLENAME . " SET shares = shares + :shares " .
                " WHERE id = :portfolio_id";
            $portfolio_params = array(portfolio_id => $this->portfolio_id, shares => $this->shares);
        }
        error_log("PORTF UPDATE: " . $query);
        getDatabase()->execute($query, $portfolio_params);

        $query = " UPDATE " . Game::GAME_SECURITY_PRICE_TABLENAME . 
            " SET outstanding = outstanding - :shares " . 
            " WHERE game_id = :game_id AND security_id = :security_id and year = :year";
        error_log("GSP UPDATE: " . $query);
        $result = getDatabase()->execute($query, array(shares => $this->shares,
        	game_id => $this->game_id,
        	security_id => $this->security_id,
        	year => $this->year));

        getDatabase()->execute("COMMIT");

        return $result;
    }

    public function saveSell() {
        $params = array(user_id => $this->user_id, 
            game_id => $this->game_id, 
            year => $this->year, 
            security_id => $this->security_id, 
            shares => $this->shares, 
            price => $this->price, 
            income => $this->income, 
            margin => $this->margin, 
            margin_charge => $this->margin_charge, 
            amount => $this->amount,
            balance => $this->balance,
            comment => $this->comment);

        getDatabase()->execute("START TRANSACTION");

        $query = " INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, year, security_id, shares, " . 
            " price, income, margin, margin_charge, amount, balance, comment) " .
            " values (:user_id, :game_id, :year, :security_id, :shares, " . 
            " :price, :income, :margin, :margin_charge, :amount, :balance, :comment)";
        error_log("SELL TXN INSERT: " . $query);
        $result = getDatabase()->execute($query, $params);

        $query .= " UPDATE " . Portfolio::TABLENAME . " SET shares = shares - :shares " .
                " WHERE game_id = :game_id AND user_id = :user_id and security_id = :security_id;";
        error_log("SELL PORTF UPDATE: " . $query);
        $result = getDatabase()->execute($query, array(shares => $this->shares,
        	game_id => $this->game_id, 
            user_id => $this->user_id, 
            security_id => $this->security_id));

        $query .= " UPDATE " . Game::GAME_SECURITY_PRICE_TABLENAME . 
            " SET outstanding = outstanding + :shares " . 
            " WHERE game_id = :game_id AND security_id = :security_id and year = :year; \n ";
        error_log("SELL GSP UPDATE: " . $query);
        $result = getDatabase()->execute($query, array(shares => $this->shares, 
	        game_id => $this->game_id, 
        	security_id => $this->security_id, 
            year => $this->year));

        getDatabase()->execute("COMMIT");

        // error_log("saveSell query: " . $query);
        return $result;
    }

    public function fetchSymbol() {
        $query = "SELECT symbol FROM " . Security::TABLENAME . " WHERE id = :security_id";
        $result = getDatabase()->one($query, array(security_id => $this->security_id));
        $this->security_symbol = $result;
    }

    public function insufficientShares($outstanding = 0) {
        // $this->comment = "Insufficient shares, " . $outstanding . " available";
        // TODO 
    }
}