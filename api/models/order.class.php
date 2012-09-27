<?php
include_once('base.class.php');

class Order extends Model {
    const TABLENAME = "txn_order";
    const VALID = 0;
    const INVALID_BUY_TOO_MANY_SHARES = 1;
    const INVALID_SELL_TOO_MANY_SHARES = 2;
    const INVALID_INSUFFICIENT_FUNDS = 4;
    
    public $id;
    public $user_id;
    public $game_id;
    public $year;
    public $action;
    public $security_id;
    public $security_symbol;
    public $shares;
    public $margin = 0;
    public $invalid;
    public $comment;

    public function __construct($order = array()) {
        //print_r($order['security']);
        $this->id = $order['id'];
        $this->user_id = $order['user_id'];
        $this->game_id = $order['game_id'];
        $this->year = $order['year'];
        $this->action = $order['action'];
        $this->security_id = $order['security_id'];
        $this->security_symbol = $order['security_symbol'];
        $this->shares = $order['shares'];
        if ( $order['margin'] == null) {
            $this->margin = 0;
        } else {
            $this->margin = $order['margin'];
        }
	    $this->invalid = $order['invalid'];
        $this->comment = $order['comment'];
        
        $this->normalize();
    }
    
    public function normalize() {
    	if ( $this->shares < 0 ) {
    		$this->shares *= -1;
    	}
    	if ( $this->invalid == null ) {
    		$this->invalid = self::VALID;
    	}
    	// HACK
    	if ( $this->security_symbol && ! $this->security_id ) {
    		error_log("normalization: fetching security id");
    		$this->security_id = Security::fetchIdForSymbol($this->security_symbol);
    	}
    }
    
    private function verify() {
    	$this->debug && error_log("Order->verify()");
    	switch ($this->action) {
    		case Transaction::BUY_ACTION:
    		$this->verifyBuyOrder();
    		break;
    		
    		case Transaction::SELL_ACTION:
    		$this->verifySellOrder();
    		break;
    		
    		default:
    		$this->verifyNullOrder();
    		break;
    	}
    }

    public function verifyBuyOrder() {
    	$this->debug && error_log("verifyBuyOrder");
        $query = "SELECT p.balance, " . 
        	" case when pf.shares is null then gsp.outstanding else gsp.outstanding + sum(pf.shares) end as available_shares, " . 
        	" (:shares * gsp.price * -1) as amount, " . 
        	" gsp.price " .
            " FROM " . Player::TABLENAME . " p " . 
            " JOIN " . Game::GAME_SECURITY_PRICE_TABLENAME . " gsp ON p.game_id = gsp.game_id" .
        	" LEFT JOIN " . Portfolio::TABLENAME . " pf ON pf.game_id = p.game_id AND pf.security_id = gsp.security_id " . 
            " WHERE p.game_id = :game_id AND gsp.year = :year AND gsp.security_id = :security_id";
		$params = array(
        	shares => $this->shares,
        	game_id => $this->game_id, 
        	year => $this->year,
        	security_id => $this->security_id);
        $this->debug && log_query($query,$params,"verifyBuyOrder");
        $row = getDatabase()->one($query, $params);
        
        error_log("available_shares = " . $row['available_shares'] 
        . " -- shares = " . $this->shares . " -- diff = " 
        . ($row['available_shares'] - $this->shares));
        
        if ( $row['available_shares'] - $this->shares < 0) {
          	$this->invalid += self::INVALID_BUY_TOO_MANY_SHARES;
        }        
    }
    
    private function verifySellOrder() {
        $query = "SELECT pf.shares " . 
            " FROM " . Portfolio::TABLENAME . " pf " .
            " WHERE pf.game_id = :game_id AND pf.user_id = :user_id AND pf.security_id = :security_id";
		$params = array(
        	game_id => $this->game_id, 
    	    user_id => $this->user_id, 
 	    	security_id => $this->security_id);
        $this->debug && log_query($query,$params,"verifySellOrder");
        $row = getDatabase()->one($query, $params);
            
        if ( $row['shares'] - $this->shares < 0) {
          	$this->invalid += self::INVALID_SELL_TOO_MANY_SHARES;
        }   
    }

    private function verifyNullOrder() {
    	//TODO
    	error_log("verifyNullOrder ==== TODO");
    }
    

    public function save() {
    	$this->verify();
    	
        $query = "INSERT INTO " . self::TABLENAME .
            " (user_id, game_id, year, action, security_id, security_symbol, shares, margin, comment, invalid) " .
            " values (:user_id, :game_id, :year, :action, :security_id, :security_symbol, :shares, :margin, :comment, :invalid)";
        $params = array(user_id => $this->user_id,
            game_id => $this->game_id,
            year => $this->year,
            action => $this->action,
            security_id => $this->security_id,
            security_symbol => $this->security_symbol,
            shares => $this->shares,
            margin => $this->margin,
            comment => $this->comment,
            invalid => $this->invalid);
        $this->debug && log_query($query, $params, "Order.save()");
        $result = getDatabase()->execute($query, $params);

        return $result;
    }
    
    public static function getOrderValidCode($code = 0) {
    	$messages = array();
	   	if ($code & self::INVALID_BUY_TOO_MANY_SHARES) {
	    	$messages[] = "Shares not available to buy";
	   		 error_log("order messages 1: " . print_r($messages,true));
	   	}	    	

	   	if ($code & self::INVALID_SELL_TOO_MANY_SHARES) {
	    	$messages[] = "Not enough shares in portfolio";
	    	error_log("order messages 2: " . print_r($messages,true));
	   	}

	   	if ($code & self::INVALID_INSUFFICIENT_FUNDS) {
	    	$messages[] = "Insufficient funds";
	    	error_log("order messages 4: " . print_r($messages,true));
	    }

	    error_log("order messages: " . print_r($messages,true));
	    $msg = implode("; ",$messages);
	    error_log("msg = " . $msg);
    	
    	return $msg;
    }
}