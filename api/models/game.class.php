<?php
include_once('base.class.php');
class Game extends Model {
	const TABLENAME = "games";
	const GAME_SECURITY_PRICE_TABLENAME = 'game_sec_price';
	const SELECT_SQL = "select * from games where id = :id";
	const SPLIT_LIMIT = 150;
	const DIVIDEND_LIMIT = 50;

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
/*		if ( $this->id ) {
			$this->fetchSettings();
			$this->fetchPlayers(); 
		} */
	}

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
		log_params($params);
		$id = getDatabase()->execute($query, $params);

		return $id;
	}

	private function createSecurities() {
		$result = false;
		$query = 'insert into ' . self::GAME_SECURITY_PRICE_TABLENAME .
            ' (game_id, security_id, year, price, split, delta, outstanding) ' . 
            ' select :game_id, s.id, 0, s.price, 0, 0, s.outstanding from security s';
		$result = getDatabase()->execute($query, array('game_id' => $this->id));
		return $result;
	}

	public function start() {
		$this->createSecurities();
		$this->setNewPrices();
		$this->advanceYear();
	}

	public function advanceYear() {
		if ( $this->year < $this->last_year ) {
			$this->year ++;
			$query = "UPDATE " . self::TABLENAME . " SET year = :year " .
                " WHERE id = :game_id";
			$result = getDatabase()->execute($query, array(game_id => $this->id, year => $this->year));
			error_log("advanceYear result " . $result);
		} else {
			error_log("game over");
		}
	}

	public function setNewPrices() {

		$chance_event = new ChanceEvent(array(game_id => $this->id, year => $this->year));
		$chance_event->createValues();
		$chance_event->save();

		// Security Delta query gets new values based on chance event.
		$sd_query = 'select :game_id, ly.security_id, :next_year, sd.delta, ' .
            ' case when (price + sd.delta) > :split_limit then ceiling((price + sd.delta) / 2) else (price + sd.delta) end as price, ' .
            ' case when (price + sd.delta) > :split_limit then 1 else 0 end as split, ' . 
        	' ly.outstanding ' .
            ' from ' . self::GAME_SECURITY_PRICE_TABLENAME . ' ly ' .
            ' join security_delta sd on ly.security_id = sd.security_id ' . 
            ' where ly.year = :previous_year and sd.roll = :roll and sd.market = :market and ly.game_id = :game_id ';

		// Insert query creates new rows in game security history table
		$iq = 'insert into ' . self::GAME_SECURITY_PRICE_TABLENAME .
            ' (game_id, security_id, year, delta, price, split, outstanding) ' .
		$sd_query;
		$params = array('game_id' => $this->id,
            'next_year' => $this->year + 1,
            'split_limit' => self::SPLIT_LIMIT, 
            'previous_year' => $this->year, 
            'roll' => $chance_event->diceValue(), 
            'market' => $chance_event->market);

		//        error_log("INSERT QUERY: " . $iq);
		//        log_params($params);
		$result = getDataBase()->execute($iq, $params);
	}

	/* for list functions we need minimal player information */
	public function fetchPlayers() {
		$this->debug && error_log("Game::fetchPlayers() enter");
		$this->players = array();
		if ( $this->id != null ) {
			if ( $this->year == 0 ) {
				$query = 'SELECT p.*, u.username, 0 as has_ordered ' .
					' FROM ' . Player::TABLENAME . ' p ' .
		            ' JOIN ' . User::TABLENAME . ' u ON p.user_id = u.id ' .
	    	        ' WHERE game_id = :game_id';
				$params = array('game_id' => $this->id);
			} else {
				$query = "SELECT p.*, u.username, " .
				" sum(case when pf.shares is null then 0 else (pf.shares * gsp.price) end) as portf_worth, " . 
				" case when count(o.id) > 0 then 1 else 0 end as has_ordered " .
	    		" from " . Player::TABLENAME . " p " .
				" join " . User::TABLENAME . " u ON p.user_id = u.id " .
	    		" join game_sec_price gsp on p.game_id = gsp.game_id " . 
	    		" left outer join portfolio pf on p.user_id = pf.user_id and p.game_id = pf.game_id and pf.security_id = gsp.security_id " . 
				" left outer join " . Order::TABLENAME . " o ON o.user_id = p.user_id and o.game_id = p.game_id and o.year = :year " .
				" where p.game_id = :game_id and gsp.year = :year group by p.user_id ";
				$params = array(game_id => $this->id, year => $this->year);
			}

			$this->debug && log_query($query, $params, "fetchPlayers");
			$rows = getDatabase()->all($query, $params);
			foreach ($rows as $row) {
				$p = new Player($row);
				//            	$p->fetchPortfolio();
				array_push($this->players, $p);
			}
		}
		$this->debug && error_log("Game::fetchPlayers() exit");
	}

	public function fetchPlayer() {
		$user_id = LoginController::getUserId();

		$query = "SELECT p.*, u.username, " .
				" sum(case when pf.shares is null then 0 else (pf.shares * gsp.price) end) as portf_worth " . 
	    		" from " . Player::TABLENAME . " p " .
				" join " . User::TABLENAME . " u ON p.user_id = u.id " .
	    		" join game_sec_price gsp on p.game_id = gsp.game_id " . 
	    		" left outer join portfolio pf on p.user_id = pf.user_id and p.game_id = pf.game_id and pf.security_id = gsp.security_id " . 
	    		" where p.game_id = :game_id and p.user_id = :user_id and gsp.year = :year ";
		$params = array(user_id => $user_id, game_id => $this->id, year => $this->year);

		$this->debug && log_query($query, $params);

		$row = getDataBase()->one($query, $params);
		//error_log(print_r($row, true));

		$this->player = new Player($row);
		$this->player->fetchTransactions();
		$this->player->fetchPortfolio();
		$this->player->fetchOrdersForYear($this->year);
		//        $this->netWorth($this->player);
	}

	public function fetchOtherPlayers() {
	}

	/*    public function netWorth($player) {
	 $query = "select p.balance + sum(pf.shares * gsp.price) as net_worth " .
	 " from " . Player::TABLENAME . " p " .
	 " join game_sec_price gsp on p.game_id = gsp.game_id " .
	 " join portfolio pf on p.user_id = pf.user_id and p.game_id = pf.game_id and pf.security_id = gsp.security_id " .
	 " where p.game_id = :game_id and p.user_id = :user_id and gsp.year = :year ";
	 $params = array(
	 game_id => $this->game_id,
	 user_id => $player->user_id,
	 year => $this->year
	 );
	 $net_worth = 0;
	 $row = getDatabase()->one($query, $params);
	 if ( $row ) {
	 $net_worth = $row['net_worth'];
	 }
	 $player->net_worth = $net_worth;
	 } */

	public function fetchSecurities() {
		$query = "select s.symbol, s.name, s.dividend, s.dividend_label, gsp.outstanding, " .
            " gsp.price, gsp.split, gsp.delta from " . Security::TABLENAME . " s " .
            " join " . self::GAME_SECURITY_PRICE_TABLENAME . " gsp " .
            " on s.id = gsp.security_id " .
            " where gsp.game_id = :game_id and gsp.year = :year " .
            " order by gsp.id";

		//$this->debug && error_log('fetchSecurities - query = ' . $query . '; game = ' . $this->id . '; year = ' . $this->year);

		$result = getDataBase()->all($query, array(game_id => $this->id, year => $this->year));

		/*        error_log(var_dump($result));*/
		$this->securities = array();
		foreach ($result as $key => $row) {
			array_push($this->securities, new Security($row));
		}
	}

	public function fetchSettings($debug = false) {
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
		//error_log("players: " . count($this->players) . "; number_of_players: " . $this->number_of_players);
		if ( ! $this->players ) {
			$this->debug && error_log("Game->isFull(): players must be fetched");
			$this->fetchPlayers();
		}
		if ( count($this->players) >= $this->number_of_players ) {
			return true;
		} else {
			return false;
		}
	}

	public function addOrders($orders = array()) {
		if ( $this->player->hasOrdered($this->year) ) {
			http_response_code(500);
			return "You have already ordered this turn";
		}
		$result = array();
		foreach ($orders['orders'] as $key => $order_data) {
			array_push($result, $this->addOrder($order_data));
		}
		
		/*
		 * TODO move this to its own method.
		 */
		$allPlayersHaveOrdered = true;
		foreach ($this->players as $player) {
			if (! $player->hasOrdered($this->year) ) {
				$allPlayersHaveOrdered = false;
			}
		}
		if ($allPlayersHaveOrdered) {
			$this->debug && error_log("Last player has ordered. Year end triggered.");
			$this->processAllOrders();
			$result['new_year'] = true;
		}
		return $result;
	}

	public function addOrder($order_data = array()) {
		$this->debug && error_log("Game->addOrder(): " . print_r($order_data, true));
		$order_data['user_id'] = $this->player->user_id;
		$order_data['game_id'] = $this->id;
		$order_data['year'] = $this->year;

		$order = new Order($order_data);
		$order->setDebug();
		$order->save();
		return $order;
	}

	/**
	 * 
	 * TODO rename this endGameYear or something.
	 */
	public function processAllOrders() {
		// end of year
		$this->processAllSellOrders();
		$this->processAllBuyOrders();
		$this->setNewPrices();
		$this->advanceYear();
		// start of next year
		$this->processSplits(true);
		$this->payDividends();
	}

	public function processAllBuyOrders() {
		// TODO get the BUY orders in the correct sequence, meaning
		// get the first order for each player in turn, then the
		// second order, and so on.
		$query = "SELECT o.user_id, o.game_id, o.year, o.action, gsp.security_id, " .
        	" gsp.outstanding, (o.shares * gsp.price * -1) as amount,  o.shares, " . 
        	" gsp.price, o.invalid, p.balance as current_balance, " . 
        	" concat('BUY ', o.shares, ' shares of ', s.name) as comment " .
            " FROM " . Order::TABLENAME . " o " .
            " JOIN " . self::GAME_SECURITY_PRICE_TABLENAME . " gsp ON o.game_id = gsp.game_id AND o.year = gsp.year " .
            " JOIN " . Security::TABLENAME . " s ON s.symbol = o.security_symbol AND gsp.security_id = s.id " . 
            " JOIN " . Player::TABLENAME . " p ON o.user_id = p.user_id and o.game_id = p.game_id " .
            " WHERE o.action = 'BUY' AND o.year = :year AND o.game_id = :game_id ";
		$params = array(year => $this->year, game_id => $this->id);
        $this->debug && log_query($query, $params, "processAllBuyOrders");
		$result = getDatabase()->all($query, $params);

		foreach ($result as $row) {
			/* Some validation can only be done in game context, 
			 * after sell orders have been processed. 
			 */
			if ( $row['invalid'] == null ) {
				$row['invalid'] = 0;
			}
			error_log("GAME BUY VALIDATION");
			error_log("too many shares? " . ($row['invalid'] & Order::INVALID_BUY_TOO_MANY_SHARES));
			if ( $row['outstanding'] - $row['shares'] < 0 
				&& ($row['invalid'] & Order::INVALID_BUY_TOO_MANY_SHARES !== Order::INVALID_BUY_TOO_MANY_SHARES)) {
				$row['invalid'] += Order::INVALID_BUY_TOO_MANY_SHARES;
			}
			
			error_log("not enough cash? " . ($row['invalid'] & Order::INVALID_INSUFFICIENT_FUNDS));
			if ( $row['current_balance'] + $row['amount'] < 0 ) {
				error_log("setting not enough cash bit");
				if (($row['invalid'] & Order::INVALID_INSUFFICIENT_FUNDS) == Order::INVALID_INSUFFICIENT_FUNDS) {
					error_log("NSF flag is already set");
				} else {
					$row['invalid'] += Order::INVALID_INSUFFICIENT_FUNDS;
				}
			}
			$txn = new Transaction($row);
			$txn->setDebug();
			$txn->save();
		}
	}

	public function processAllSellOrders() {
		$query = "SELECT o.user_id, o.game_id, o.year, o.action, gsp.security_id, " .
        	" (o.shares * gsp.price) as amount, " . 
        	" case when o.shares > 0 then (o.shares * -1) else o.shares end as shares, " .
        	" gsp.price, o.invalid, concat('SELL ', o.shares, ' shares of ', s.name) as comment " .
        	" FROM " . Order::TABLENAME . " o " .
            " JOIN " . self::GAME_SECURITY_PRICE_TABLENAME . " gsp ON o.game_id = gsp.game_id AND o.year = gsp.year " .
            " JOIN " . Security::TABLENAME . " s ON s.symbol = o.security_symbol AND gsp.security_id = s.id " . 
            " WHERE o.action = 'SELL' AND o.year = :year AND o.game_id = :game_id ";

		$result = getDatabase()->all($query, array(year => $this->year, game_id => $this->id));

		foreach ($result as $key => $row) {
			$txn = new Transaction($row);
			$txn->setDebug();
			$txn->save();
		}
	}

	public function payDividends() {
		error_log("game.payDividends()");
		$query = "select gsp.price as current_price, pf.user_id, pf.game_id, gsp.year, pf.security_id, " .
    	" case when gsp.price >= :dividend_limit then pf.shares * s.dividend else 0 end as income, " .
    	" 'DIV' as action, " .
    	" case when gsp.price >= :dividend_limit then concat(s.dividend_label, ': ', s.name) else 'Dividend suspended' end as comment " . 
      	" from portfolio pf " .
    	" join security s on pf.security_id = s.id " .
    	" join game_sec_price gsp on pf.security_id = gsp.security_id and gsp.game_id = pf.game_id and gsp.year = :year " . 
    	" where pf.game_id = :game_id and s.dividend > 0 and pf.shares > 0";
		$params = array(
		year => $this->year,
		game_id => $this->id,
		dividend_limit => self::DIVIDEND_LIMIT
		);
		//    	error_log($query);
		//    	log_params($params);
		$rows = getDatabase()->all($query, $params);
		foreach ($rows as $key => $row) {
			if ( $row['current_price'] >= self::DIVIDEND_LIMIT ) {
				$txn = new Transaction($row);
				$result = $txn->save();
			} else {
				error_log("===== DIVIDEND NOT PAYABLE =====");
			}
		}
	}

	public function processSplits($debug = false) {
		$debug && error_log("processSplits");
		 
		$query = "select pf.user_id, pf.game_id, gsp.year, pf.security_id, " .
    	" pf.shares, 'SPLIT' as action, " .
    	" concat(s.name, ' share split 2 for 1') as comment " . 
      	" from portfolio pf " .
    	" join security s on pf.security_id = s.id " .
    	" join game_sec_price gsp on pf.security_id = gsp.security_id and gsp.game_id = pf.game_id and gsp.year = :year " . 
    	" where gsp.split = 1 and pf.game_id = :game_id and pf.shares > 0";
		$params = array(
		year => $this->year,
		game_id => $this->id
		);
		$debug && error_log($query);
		$debug && log_params($params);
		$rows = getDatabase()->all($query, $params);
		foreach ($rows as $row) {
			$txn = new Transaction($row);
			$txn->save();
		}
		 
		$query = "update " . self::GAME_SECURITY_PRICE_TABLENAME . " set outstanding = outstanding * 2, split = 2 " .
        	" where split = 1 and game_id=:game_id and year = :year ";
		$params = array(game_id => $this->id, year => $this->year);
		$debug && error_log($query);
		$debug && log_params($params);
		$result = getDatabase()->execute($query, $params);
	}

}
