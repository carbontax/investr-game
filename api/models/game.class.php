<?php
class Game {
    const TABLENAME = "games";
    const GAME_SECURITY_PRICE_TABLENAME = 'game_sec_price';
    const SELECT_SQL = "select * from games where id = :id";

    public $id;
    public $initial_balance;
    public $settings;
    public $start_date;
    public $number_of_players;
    public $players;
    public $player;
    public $other_players;
    public $securities;
    public $year;
    public $last_year;
    public $turn;

    public function __construct($game = array()) {
        $this->id = $game['id'];
        $this->start_date = $game['start_date'];
        $this->initial_balance = $game['initial_balance'];
/*        $this->player = $game['player'];
        $this->other_players = $game['other_players'];
        $this->securities = $game['securities'];*/
        $this->number_of_players = $game['number_of_players'];
        $this->year = $game['year'];
        $this->last_year = $game['last_year'];
        $this->turn = $game['turn'];
        $this->fetchSettings();
        $this->fetchPlayers();
    }
    
/*    public static function createNewGame($game = array()) {
        $id = $game['id'];
        $start_date = $game['start_date'];
        $initial_balance = $game['initial_balance'];
        $number_of_players = $game['number_of_players'];
        $last_year = $game['last_year'];
        return new self($id, $start_date, $initial_balance, $number_of_players, $last_year);
    } */
    
    public function save() {
    	$query = 'insert into games ' . 
            ' (initial_balance, start_date, number_of_players, year, last_year) ' .
        	' values(:initial_balance, :start_date, :number_of_players, :year, :last_year) ';
    	$params = array(initial_balance => $this->initial_balance,
                start_date => strftime('%Y-%m-%d', time()),
                number_of_players => $this->number_of_players,
                year => $this->year,
                last_year => $this->last_year);
        error_log("SAVE NEW GAME");
        error_log($query);
        error_log(print_r($params, true));
        $id = getDatabase()->execute($query, $params);
        if ( $id ) {
            GameController::apiGameJoin($id);
        }
        return $id;
    }

    private function createSecurities() {
        $result = false;
        $query = 'insert into ' . self::GAME_SECURITY_PRICE_TABLENAME . 
            ' (game_id, security_id, year, price, split, delta, outstanding) ' . 
            ' select :game_id, s.id, 0, s.price, 0, 0, s.outstanding from security s';
 //       error_log("createSecurities: " . $query);
//        try {
            $result = getDatabase()->execute($query, array('game_id' => $this->id));
//        } catch (Exception $e) {
//            error_log($e);
//        }
        return $result;
    }

    public function start() {
    	$this->createSecurities();
        $this->setNewPrices();
        $this->advanceYear();
    }
    
    public function advanceYear() {
        if ( $this->year < $this->last_year ) {
            $query = "UPDATE " . self::TABLENAME . " SET year = year + 1 " .
                " WHERE id = :game_id";
            $result = getDatabase()->execute($query, array("game_id" => $this->id));
            error_log("advanceYear result " . $result);
        } else {
            error_log("game over");
        }
    }

    public function setNewPrices() {
        $split_limit = 150;

        $chance_event = new ChanceEvent(array(game_id => $this->id, year => $this->year));
        $chance_event->createValues();
        $chance_event->save();

        $sd_query = 'select :game_id, ly.security_id, :next_year, sd.delta, ' . 
            ' case when (price + sd.delta) > :split_limit then ceiling((price + sd.delta) / 2) else (price + sd.delta) end as price, ' .
            ' case when (price + sd.delta) > :split_limit then 1 else 0 end as split ' . 
            ' from ' . self::GAME_SECURITY_PRICE_TABLENAME . ' ly ' .
            ' join security_delta sd on ly.security_id = sd.security_id ' . 
            ' where ly.year = :previous_year and sd.roll = :roll and sd.market = :market';
//        $sd_query = 'select * from security_delta where roll = :roll and market = :market';
        error_log('sd_query: ' . $sd_query);

 /*       $r = getDatabase()->all($sd_query, 
            array('previous_year' => $this->year, 'split_limit' => $split_limit, 'roll' => $roll, 'market' => $market));*/
        $iq = 'insert into ' . self::GAME_SECURITY_PRICE_TABLENAME .
            ' (game_id, security_id, year, delta, price, split) ' .
            $sd_query;

//        error_log("INSERT QUERY: " . $iq);
        $result = getDataBase()->execute($iq, array('game_id' => $this->id, 
            'next_year' => $this->year + 1,
            'split_limit' => $split_limit, 
            'previous_year' => $this->year, 
            'roll' => $chance_event->diceValue(), 
            'market' => $chance_event->market));
//        error_log("setNewPrices result = " . $result);
/*        }*/
    }

    /* for list functions we need minimal player information */
    public function fetchPlayers() {
        $this->players = array();
        if ( $this->id != null ) {
/*            $query = 'SELECT u.username as username ' .
                ' FROM users u ' . 
                ' WHERE u.id IN ' .
                ' (SELECT p.user_id FROM player p WHERE p.game_id = :game_id)';*/
            $query = 'SELECT * FROM ' . Player::TABLENAME . ' WHERE game_id = :game_id';
            $data = getDatabase()->all($query, array('game_id' => $this->id));
            foreach ($data as $key => $row) {
                array_push($this->players, new Player($row)); 
            }
        }        
    }

    public function fetchPlayer() {
        $user_id = LoginController::getUserId();

        $query = "SELECT * FROM " . Player::TABLENAME .
            " WHERE user_id = :user_id and game_id = :game_id ";
        error_log("getPlayer - query = " . $query . " -- user_id = " . $user_id);

        $row = getDataBase()->one($query, array(user_id => $user_id, game_id => $this->id));
	    //error_log(print_r($row, true));
//        $this->player = Player::withRow($row);
		$this->player = new Player($row);
        $this->player->fetchTransactions();
        $this->player->fetchPortfolio();
        $this->player->fetchOrdersForYear($this->year);
    }

    public function fetchOtherPlayers() {
    }

    public function fetchSecurities() {
        $query = "select s.symbol, s.name, s.dividend, s.dividend_label, gsp.outstanding, " . 
            " gsp.price, gsp.split, gsp.delta from " . Security::TABLENAME . " s " .
            " join " . self::GAME_SECURITY_PRICE_TABLENAME . " gsp " .
            " on s.id = gsp.security_id " .
            " where gsp.game_id = :game_id and gsp.year = :year " .
            " order by gsp.id";
        
        error_log('getSecurities - query = ' . $query . '; game = ' . $this->id . '; year = ' . $this->year);

        $result = getDataBase()->all($query, array(game_id => $this->id, year => $this->year));

/*        error_log(var_dump($result));*/
        $this->securities = array();
        foreach ($result as $key => $row) {
            array_push($this->securities, new Security($row));
        }
    }

    public function fetchSettings() {
        $this->settings = array();
        if ( $this->id != null ) {
            $query = 'SELECT s.name as k, gs.value as v ' .
                ' FROM game_settings as gs ' . 
                ' JOIN settings as s ON gs.settings_id = s.id ' .
                ' WHERE gs.game_id = :game_id';
            $data = getDatabase()->all($query, array('game_id' => $this->id));
            foreach ($data as $key => $row) {
                $this->settings[$row['k']] = $row['v']; 
            }
        }
    }

    public function isFull() {
        error_log("players: " . count($this->players) . "; number_of_players: " . $this->number_of_players);
        if ( count($this->players) >= $this->number_of_players ) {
            return true;
        } else {
            return false;
        }
    }

    public function addOrders($orders = array()) {
        //print_r($orders);
        if ( $this->player->hasOrdered($this->year) ) {
            http_response_code(500);
            return "You have already ordered this turn";
        }
        $result = array();
        foreach ($orders['orders'] as $key => $order_data) {
            //print_r($order_data);
            array_push($result, $this->addOrder($order_data));
        }
        return $result;
    }

    public function addOrder($order_data = array()) {
        $order_data['user_id'] = $this->player->user_id;
        $order_data['game_id'] = $this->id;
        $order_data['year'] = $this->year;

        $order = new Order($order_data);
        $order->save();
        return $order;
    }

    public function processAllOrders() {
        $this->processAllSellOrders();
        $this->processAllBuyOrders();
        // $this->payDividends();
        $this->setNewPrices();
        $this->processSplits();
        $this->advanceYear();
    }

    public function processAllBuyOrders() {
        // TODO get the BUY orders in the correct sequence, meaning
        // get the first order for each player in turn, then the 
        // second order, and so on.
        /*
        select o.user_id, o.game_id, o.year, gsp.security_id, o.shares, 
        null, null, null, concat("Buy ", o.shares, " shares of ", o.security_symbol) as comment 
        from txn_order o 
        join game_sec_price gsp on o.game_id = gsp.game_id and o.year = gsp.year 
        join security s on gsp.security_id = s.id and s.symbol = o.security_symbol ;
        */

        $query = "SELECT o.*, gsp.security_id, gsp.outstanding, (o.shares * gsp.price * -1) as amount " . 
            " FROM " . Order::TABLENAME . " o " .
            " JOIN " . self::GAME_SECURITY_PRICE_TABLENAME . " gsp ON o.game_id = gsp.game_id AND o.year = gsp.year " .
            " JOIN " . Security::TABLENAME . " s ON s.symbol = o.security_symbol AND gsp.security_id = s.id " . 
            " WHERE o.action = 'BUY' AND o.year = :year AND o.game_id = :game_id ";

        error_log("processAllBuyOrders");
        error_log($query);
        $result = getDatabase()->all($query, array(year => $this->year, game_id => $this->id));

        foreach ($result as $key => $row) {
            $txn = new Transaction($row);
            if ( $row['outstanding'] - $row['shares'] >= 0 ) {
                $txn->comment = "Bought " . $row['shares'] . " shares of " . $row['security_symbol'];
                $txn->saveBuy();
            } else {
                $txn->insufficientShares($row['outstanding']);
                //$txn->saveBuy();
                error_log("INSUFFICIENT SHARES");
            }
        }
    }

    public function processAllSellOrders() {
        $query = "SELECT o.*, gsp.security_id, (o.shares * gsp.price) as amount " . 
            " FROM " . Order::TABLENAME . " o " .
            " JOIN " . self::GAME_SECURITY_PRICE_TABLENAME . " gsp ON o.game_id = gsp.game_id AND o.year = gsp.year " .
            " JOIN " . Security::TABLENAME . " s ON s.symbol = o.security_symbol AND gsp.security_id = s.id " . 
            " WHERE o.action = 'SELL' AND o.year = :year AND o.game_id = :game_id ";

        $result = getDatabase()->all($query, array(year => $this->year, game_id => $this->id));

        foreach ($result as $key => $row) {
            $txn = new Transaction($row);
            $txn->saveSell();
        }
    }

    public function processSplits() {
        error_log("processSplits() was called -- not yet implemented");
    }

}
