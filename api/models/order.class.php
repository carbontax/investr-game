<?php
class Order {
    const TABLENAME = "txn_order";
    const INVALID_BUY_TOO_MANY_SHARES = 1;
    const INVALID_SELL_TOO_MANY_SHARES = 2;

    public $id;
    public $user_id;
    public $game_id;
    public $year;
    public $action;
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
    		$this->invalid = 0;
    	}
    }
    
    private function verify() {
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
    	error_log("verifyBuyOrder");
        $query = "SELECT p.balance, gsp.outstanding + sum(pf.shares) as available_shares, (:shares * gsp.price * -1) as amount, " . 
        	" gsp.price, s.name " .
            " FROM " . Player::TABLENAME . " p " . 
            " JOIN " . Game::GAME_SECURITY_PRICE_TABLENAME . " gsp ON p.game_id = gsp.game_id" .
            " JOIN " . Security::TABLENAME . " s ON gsp.security_id = s.id " . 
        	" JOIN " . Portfolio::TABLENAME . " pf ON pf.game_id = p.game_id AND pf.security_id = gsp.security_id " . 
            " WHERE p.game_id = :game_id AND gsp.year = :year AND s.symbol = :security_symbol";

        error_log("verifyBuyOrder");
        error_log($query);
        $row = getDatabase()->all($query, array(
        	shares => $this->shares,
        	game_id => $this->game_id, 
        	year => $this->year,
        	security_symbol => $this->security_symbol));
            
        if ( $row['available_shares'] < $row['shares'] ) {
          	$this->invalid += self::INVALID_BUY_TOO_MANY_SHARES;
        }
        
    }
    
    private function verifySellOrder() {
    	error_log("verifyBuyOrder");
        $query = "SELECT pf.shares " . 
            " FROM " . Portfolio::TABLENAME . " pf " .
            " JOIN " . Security::TABLENAME . " s ON pf.security_id = s.id " . 
            " WHERE pf.game_id = :game_id AND pf.user_id = :user_id AND s.symbol = :security_symbol";

        error_log("verifySellOrder");
        error_log($query);
        $row = getDatabase()->all($query, array(
        	game_id => $this->game_id, 
    	    user_id => $this->user_id, 
 	    	security_symbol => $this->security_symbol));
            
        if ( $row['shares'] < $row['shares'] ) {
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