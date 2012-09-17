<?php
class Transaction {
    const TABLENAME = "txn";
    const BUY_ACTION = "BUY";
    const SELL_ACTION = "SELL";
    const DIVIDEND_ACTION = "DIV";
    const SPLIT_ACTION = "SPLIT";
        
    public $id;
    public $user_id;
    public $game_id;
    public $year;
    public $security_id;
    public $shares;
    public $price;
    public $amount;
    public $income;
    public $margin_charge;
    public $balance;
    public $margin;
    public $comment;
    public $action;
    public $previous_balance;

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
        $this->action = $txn['action'];
        $this->comment = $txn['comment'];
//        $this->verify();
    }
    
    private function verify() {
    	error_log("verify() -- not implemented yet");
    }
    
    public function save() {
    	switch ($this->action) {
    		case self::BUY_ACTION:
    		$result = $this->saveBuy();
    		break;
    		
    		case self::SELL_ACTION:
    		$result = $this->saveSell();
    		break;
    		
    		case self::DIVIDEND_ACTION:
    		$result = $this->saveDividend();
    		break;
    		
    		case self::SPLIT_ACTION:
    		$result = $this->saveSplit();
    		break;
    		
    		default:
    		$result = $this->saveNull();
    		break;
    	}
    	return $result;
    }

    public function saveBuy() {
//    	error_log("SAVE BUY TXN");
    	
        getDatabase()->execute("START TRANSACTION");

        $this->fetchPreviousBalance();
        
        $query = " INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, year, security_id, shares, " . 
            " price, income, margin, margin_charge, amount, balance, comment) " .
            " values (:user_id, :game_id, :year, :security_id, :shares, " . 
            " :price, :income, :margin, :margin_charge, :amount, :balance, :comment)";
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
            balance => $this->previous_balance + $this->amount,
            comment => $this->comment);
        
//        error_log("TXN INSERT: " . $query);
//        error_log(print_r($params, true));
        getDatabase()->execute($query, $params);

        $this->updatePortfolio();
        $this->updateBalance();

        $query = " UPDATE " . Game::GAME_SECURITY_PRICE_TABLENAME . 
            " SET outstanding = outstanding - :shares " . 
            " WHERE game_id = :game_id AND security_id = :security_id and year = :year";
//        error_log("GSP UPDATE: " . $query);
        $result = getDatabase()->execute($query, array(shares => $this->shares,
        	game_id => $this->game_id,
        	security_id => $this->security_id,
        	year => $this->year));

        getDatabase()->execute("COMMIT");

        return $result;
    }
    
    public function saveSell() {
//    	error_log("SAVE SELL TXN");
    	
        getDatabase()->execute("START TRANSACTION");

        $this->fetchPreviousBalance();
        
        $query = " INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, year, security_id, shares, " . 
            " price, income, margin, margin_charge, amount, balance, comment) " .
            " values (:user_id, :game_id, :year, :security_id, :shares, " . 
            " :price, :income, :margin, :margin_charge, :amount, :balance, :comment)";
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
            balance => $this->previous_balance + $this->amount,
            comment => $this->comment);
 
//        error_log("SELL TXN INSERT: " . $query);
        log_params($params);
        
        $result = getDatabase()->execute($query, $params);

		$this->updatePortfolio();
		$this->updateBalance();

        $query = " UPDATE " . Game::GAME_SECURITY_PRICE_TABLENAME . 
            " SET outstanding = outstanding + :shares " . 
            " WHERE game_id = :game_id AND security_id = :security_id and year = :year; \n ";
        error_log("SELL GSP UPDATE: " . $query);
        $result = getDatabase()->execute($query, array(shares => $this->shares, 
	        game_id => $this->game_id, 
        	security_id => $this->security_id, 
            year => $this->year));

        getDatabase()->execute("COMMIT");

        return $result;
    }
    
    public function saveDividend() {
        
    	getDatabase()->execute("START TRANSACTION");
        
    	$this->fetchPreviousBalance();
        $balance = $this->previous_balance + $this->income;
    	        
        $query = " INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, year, security_id, shares, " . 
            " price, income, margin, margin_charge, amount, balance, comment) " .
            " values (:user_id, :game_id, :year, :security_id, :shares, " . 
            " :price, :income, :margin, :margin_charge, :amount, :balance, :comment)";
        $params = array(user_id => $this->user_id, 
            game_id => $this->game_id, 
            year => $this->year, 
            security_id => $this->security_id, 
            shares => $this->shares, 
            price => null, 
            income => $this->income, 
            margin => $this->margin, 
            margin_charge => $this->margin_charge, 
            amount => $this->amount,
            balance => $balance,
            comment => $this->comment);
        
        $result = getDatabase()->execute($query, $params);
        
        if ( ! $result ) {
        	error_log(" ======= INSERT DIVIDEND TXN FAILED ======== ");
        	getDatabase()->execute("ROLLBACK");
        } else {
        	$query = "UPDATE " . Player::TABLENAME . " SET balance = :balance " . 
        	"WHERE user_id = :user_id AND game_id = :game_id ";
	        $params = array(user_id => $this->user_id, game_id => $this->game_id, balance => $balance );
    	    $result = getDatabase()->execute($query, $params);
        }

        getDatabase()->execute("COMMIT");
    }
    
    public function saveSplit() {
    	error_log(" ========== SAVE SPLIT TXN ======== ");
    	
        getDatabase()->execute("START TRANSACTION");

        $this->fetchPreviousBalance();
        
        $query = self::insertQuery();
        $params = $this->dbParams(array(balance => $this->previous_balance));
        
        error_log("TXN INSERT: " . $query);
        error_log(print_r($params, true));
        $result = getDatabase()->execute($query, $params);
        
        if ( ! $result ) {
        	error_log(" ======= INSERT SHARE SPLIT TXN FAILED ======== ");
        	getDatabase()->execute("ROLLBACK");
        } else {
	        $this->updatePortfolio();
        }

        getDatabase()->execute("COMMIT");

        return $result;
    }
    
    public function saveNull() {
    	error_log("save Null not implemented yet");
    }
    
    private function updateBalance() {
    	$query = "UPDATE " . Player::TABLENAME . " SET balance = balance + :amount "
    	. " WHERE user_id = :user_id AND game_id = :game_id";
    	error_log("updateBalance: " . $query);
    	$params = array(amount => $this->amount,
    		user_id => $this->user_id, 
    		game_id => $this->game_id);
    	error_log(print_r($params, true));
    	$result = getDatabase()->execute($query, $params);
    }
    
    private function updatePortfolio() {
    	// Get the portfolio id if it exists
    	$pf_query = "SELECT id from " . Portfolio::TABLENAME . " " .
        	" WHERE user_id = :user_id AND game_id = :game_id AND security_id = :security_id";
        $pf_row = getDatabase()->one($pf_query, array(
        	user_id => $this->user_id, 
        	game_id => $this->game_id, 
        	security_id => $this->security_id));
        	
        $portfolio_id = null;
        if ( $pf_row ) {
        	error_log("PORTFOLIO ID FOUND");
        	$portfolio_id = $pf_row['id'];
        }
        error_log("UPDATE PORTF: id = " . $portfolio_id);
    	
    	$query = " UPDATE " . Portfolio::TABLENAME . 
    			" SET shares = shares + :shares " .
                " WHERE id = :portfolio_id";
    	$params = array(
    		portfolio_id => $portfolio_id, 
    		shares => $this->shares
    	);
    	
    	if ( $portfolio_id == null ) {
            $query = " INSERT INTO " . Portfolio::TABLENAME . 
                " (game_id, user_id, security_id, shares) " . 
                " values (:game_id, :user_id, :security_id, :shares)";
            $params = array(
                    game_id => $this->game_id, 
	            	user_id => $this->user_id,
	                security_id => $this->security_id, 
	            	shares => $this->shares);
        }
        error_log("PORTF UPDATE: " . $query);
        error_log("PORTF UPDATE: " . print_r($params,true));
		$result = getDatabase()->execute($query, $params);
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
    
    public function fetchPreviousBalance() {
    	error_log("fetchPreviousBalance");
    	$query = "SELECT balance FROM " . Player::TABLENAME . 
    		" WHERE user_id = :user_id AND game_id = :game_id ";
        $params = array(game_id => $this->game_id, user_id => $this->user_id);
    	$row = getDatabase()->one($query, $params);
    	$this->previous_balance = $row['balance'];
    }
    
    private static function insertQuery() {
    	return " INSERT INTO " . self::TABLENAME . 
            " (user_id, game_id, year, security_id, shares, " . 
            " price, income, margin, margin_charge, amount, balance, comment) " .
            " values (:user_id, :game_id, :year, :security_id, :shares, " . 
            " :price, :income, :margin, :margin_charge, :amount, :balance, :comment)";
    }
    
    private function dbParams($override = array()) {
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
        foreach ($override as $key => $value) {
        	if ( array_key_exists($key, $params) ) {
        		$params[$key] = $value;
        	}
        }
        return $params;
    }
}