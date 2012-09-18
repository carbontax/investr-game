<?php
class GameController
{
/*    static public function apiGames() {
        $username = getSession()->get(Constants::USERNAME);
        if ( ! $username ) {
            http_response_code(401);
            return "Please log in";
        } else {
            return json_encode(self::getDummyGames());
        }
    }*/
    static public function apiActiveGames() {
        $games = array();
        $user_id = LoginController::getUserId();
        $query = 'SELECT g.id, g.start_date, g.year, g.number_of_players, count(o.id) ' .
            ' as turn FROM ' . Game::TABLENAME . ' g ' .
            ' JOIN ' . Player::TABLENAME . ' p ' .
            ' ON g.id = p.game_id ' .
            ' LEFT JOIN ' . Order::TABLENAME . ' o ' .
            ' ON p.user_id = :user_id AND p.user_id = o.user_id AND p.game_id = o.game_id AND o.year = g.year ' .
            ' where g.year > 0 ' . 
            ' AND g.year < g.last_year ' .
            ' AND g.id IN ' .
            ' (select game_id FROM player WHERE user_id = :user_id) ' .
            ' group by g.id, g.start_date, g.year, g.number_of_players ';

        $result = getDatabase()->all($query,
            array('user_id' => $user_id));

        if ( $result !== false ) {
            foreach ($result as $key => $game) {
                array_push($games, new Game($game));
            }
        }
        return $games;
    }

    static public function apiGame($game_id) {
        $user_id = LoginController::getUserId();
        $query = 'select * from ' . Game::TABLENAME . ' where id = :game_id ' .
            ' and id in ' .
            ' (select game_id from ' . Player::TABLENAME . ' where user_id = :user_id) ';
        $params = array(game_id => $game_id, user_id => $user_id);

        error_log("apiGame(): " . $query);
        log_params($params);
        $game_data = getDataBase()->one($query, $params);
//        error_log(print_r($game_data, true));
        $game = new Game($game_data);
        $game->fetchSecurities();
        $game->fetchPlayer();
        return $game;
    }

    static private function getGame($game_id) {
        $game_data = getDataBase()->one('select * from games where id = :game_id', array('game_id' => $game_id));
        return new Game($game_data);
    }

    static public function apiGetNewGame() {    	
        $username = LoginController::getUsername();
//        $player = new Player(array('username' => $username));
        $now = strftime('%Y %b %e', time());
        $game_data = array(start_date => $now,
            number_of_players => 4,
            initial_balance => 5000,
            year => 0,
            last_year => 10);
        return new Game($game_data);
    }

    static public function apiPostNewGame() {
        $game_data = $_POST;
        error_log("POST NEW GAME: " . print_r($game_data, true));
        $game = new Game($game_data);        
        try {
		    $id = $game->save();
		    error_log("NEW GAME ID IS " . $id);
        } catch(Exception $e) {
        	http_response_code(500);
        	return "Cannot create a new game.";
        }
//		$savedGame = self::apiGame($id);
		$game = self::getGame($id);
        return $game;
    }

    static public function parsePostGameData() {
    	$stream = file_get_contents('php://input');
        $game_data = json_decode($stream, true);
		return $game_data;
    }

    static public function apiGameJoin($game_id) {
        $user_id = LoginController::getUserId();

        $game = self::getGame($game_id);
        if ( $game->isFull() ) {
            http_response_code(500);
            return "Game is full";
        }

        try {
            $player = new Player(array(
            	user_id => $user_id, 
            	game_id => $game_id, 
            	balance => $game->initial_balance));
            $player->save();

            $game = self::getGame($game_id);
            if ( $game->isFull() ) {
            	error_log("apiGameJoin: === STARTING GAME ===");
                $game->start();
            } 
        } catch(Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            return "You cannot join that game. Are you already a player?";
        }

        return $game;
    }

    // unused
    static public function apiGameStart($game_id) {
        if ( $user_id = null ) {
            $user_id = LoginController::getUserId();
        }
        $game = self::apiGame($game_id);
        $game->start();
        return $game;
    }

    // disabled
    static public function apiNewGames() {
        $newGames = array();
        $query = 'SELECT * FROM ' . Game::TABLENAME . 
            ' where year = 0 '/* . 
            ' AND id not in ' . 
            '(select game_id from ' . Player::TABLENAME . ' WHERE user_id = :user_id)'*/;
        error_log("apiNewGames");
        error_log($query);
        $result = getDatabase()->all($query, array(user_id => LoginController::getUserId()));
        if ( $result !== false ) {
            foreach ($result as $key => $row) {
            	$newGame = new Game($row);
//            	$newGame->fetchPlayer();
                array_push($newGames, $newGame);
            }
        }
        return $newGames;
    }
    
    // DEVEL ONLY
    static public function apiGameProcessOrders($game_id) {
        $game = self::apiGame($game_id);
        $game->processAllOrders();
    }

    static public function apiGameDelete($game_id) {
    	$query = "delete from " . Player::TABLENAME . " where game_id=:game_id";
    	getDatabase()->execute($query, array(game_id => $game_id));

    	$query = "delete from " . Transaction::TABLENAME . " where game_id=:game_id";
    	getDatabase()->execute($query, array(game_id => $game_id));
    	
    	$query = "delete from " . Game::GAME_SECURITY_PRICE_TABLENAME . " where game_id=:game_id";
    	getDatabase()->execute($query, array(game_id => $game_id));
    	
    	$query = "delete from " . Portfolio::TABLENAME . " where game_id=:game_id";
    	getDatabase()->execute($query, array(game_id => $game_id));
    	
    	$query = "delete from " . Game::TABLENAME . " where id=:game_id";
    	getDatabase()->execute($query, array(game_id => $game_id));
    	
    	return "Game " . $game_id . " deleted";
    }
    
    static public function apiGamePayDividends($game_id) {
    	$game = self::apiGame($game_id);
    	$game->payDividends();
    	return "DIVIDENDS PAID FOR YEAR " . $game->year;
    }

}