<?php
class GameController
{
	/**
	 * @deprecated
	 * Enter description here ...
	 */
    static public function apiActiveGames() {
        $games = array();
        $user = UserController::getLoggedInUser();
        $query = 'SELECT g.id, g.start_date, g.year, g.last_year, g.number_of_players, count(o.id) ' .
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
            array('user_id' => $user->id));

        if ( $result !== false ) {
            foreach ($result as $game_data) {
            	$game = new Game($game_data);
            	// $game->setDebug();
            	$game->fetchSettings();
            	$game->fetchPlayers();
                array_push($games, $game);
            }
        }
        return $games;
    }

   static public function apiGame($game_id) {
   		error_log("apiGame enter with " . $game_id);
   		$game == null;
   		
        $user = UserController::getLoggedInUser();
        if ( $user->isAdmin() ) {
    		$query = 'select * from ' . Game::TABLENAME . ' where id = :game_id ';
        	$params = array(game_id => $game_id);
        } else {
           	$query = 'select * from ' . Game::TABLENAME . ' where id = :game_id ' .
    	        ' and id in ' .
        	    ' (select game_id from ' . Player::TABLENAME . ' where user_id = :user_id) ';
	        $params = array(game_id => $game_id, user_id => $user->id);
        }
        log_query($query, $params, "apiGame");
        
        $game_data = getDataBase()->one($query, $params);
        if ( $game_data ) {
	        error_log("apiGame: game_data FOUND " . print_r($game_data, true));
	        $game = new Game($game_data);
	        $game->setDebug();
	        if ( $game->allPlayersHaveOrdered() ) {
	        	$game->processAllOrders();
	        }
 	        $game->fetchSecurities();
	        $game->fetchPlayer();
	        $game->fetchPlayers();
        } else {
        	error_log($user->username ." HAS NO ACCESS TO GAME " . $game_id);
        }
   		error_log("apiGame exit");
        return $game;
    }
    
    static public function apiGameYear($game_id) {
        $user = UserController::getLoggedInUser();
    	$query = 'select year from ' . Game::TABLENAME . ' where id = :game_id ' .
            ' and id in ' .
            ' (select game_id from ' . Player::TABLENAME . ' where user_id = :user_id) ';
        $params = array(game_id => $game_id, user_id => $user->id);

        log_query($query, $params, "apiGameYear");
        $row = getDataBase()->one($query, $params);
        return $row;
    }

    static private function getGame($game_id) {
        $game_data = getDataBase()->one('select * from games where id = :game_id', array('game_id' => $game_id));
        return new Game($game_data);
    }

    static public function apiGetNewGame() {    	
        $now = strftime('%Y %b %e', time());
        $game_data = array(start_date => $now,
            number_of_players => 4,
            initial_balance => 5000,
            year => 0,
            last_year => 10);
        return new Game($game_data);
    }

    static public function parsePostGameData() {
    	$stream = file_get_contents('php://input');
        $game_data = json_decode($stream, true);
		return $game_data;
    }

    static public function apiGameJoin($game_id) {
        $user_id = LoginController::getUserId();

        $game = self::getGame($game_id);
        $game->setDebug();
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
            foreach ($result as $row) {
            	$newGame = new Game($row);
            	$newGame->setDebug();
            	$newGame->fetchPlayers();
                array_push($newGames, $newGame);
            }
        }
        return $newGames;
    }
    
    public static function apiPollGame($game_id) {
    	error_log("apiPollGame enter with " . $game_id);
		
       	$gs = $_POST['gs'];
       	error_log("apiPollGame: GAMESTATE=" . $gs);
       	   		
        $user = UserController::getLoggedInUser();
        $query = 'select * from ' . Game::TABLENAME . ' where id = :game_id ' .
    	        ' and id in ' .
        	    ' (select game_id from ' . Player::TABLENAME . ' where user_id = :user_id) ';
	    $params = array(game_id => $game_id, user_id => $user->id);
        log_query($query, $params, "apiPollGame");
        
        $game == null;
        $game_data = getDataBase()->one($query, $params);
        if ( $game_data ) {
	        error_log("apiGame: game_data FOUND " . print_r($game_data, true));
	        $game = new Game($game_data);
	        $game->setDebug();
//	        if ( $game->allPlayersHaveOrdered() ) {
//	        	$game->processAllOrders();
//	        }
// 	        $game->fetchSecurities();
//	        $game->fetchPlayer();
	        $game->fetchPlayerSummaries();
        } else {
        	error_log($user->username ." HAS NO ACCESS TO GAME " . $game_id);
        }

        $gamestate = $game->getGameState();
    	$match = ($gs === $gamestate);
        error_log("apiPollGame exit. GS: " . $gs . "; getGameState = " . $gamestate . "; match = " . $match);
    	if ( ! $match ) {
        	error_log("apiPollGame <<<<<<<<<<<<<<<<<<<<<< RELOAD");
    		$game->fetchSecurities();
    		$game->fetchPlayer();
    		$game->fetchPlayers();
    		return $game;
    	}
   		
    }
    
    
}