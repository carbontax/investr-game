<?php 
class AdminGameController {
	
	public static function printMenu($path = "") {
		$path = AdminController::getAdminDir();
		echo "<p><ul>" . PHP_EOL;
		echo "<li><a href='" . $path . "'>HOME</a></li>" . PHP_EOL;
		echo "<li><a href='" . $path . "/games'>GAMES</a></li>" . PHP_EOL;
		echo "<li><a href='" . $path . "/games/active'>ACTIVE GAMES</a></li>" . PHP_EOL;
		echo "<li><a href='" . $path. "/games/completed'>COMPLETED GAMES</a></li>" . PHP_EOL;
		echo "</ul>" . PHP_EOL;
	}
	
	public static function getGames() {
		AdminController::printHeader();
		self::printMenu();
		include('new_game_form.php');
	}
			
	public static function getActiveGames() {
		$games = self::fetchActiveGameArray();
		AdminController::printHeader();
		self::printMenu();
		echo "<ul>\n";
		foreach ($games as $game) {
			echo "<li><a href='" . $game->id . "'>GAME #" . $game->id . "</a></li>\n";
		}
		echo "</ul>\n";
	}

	public static function fetchActiveGameArray() {
		error_log("AdminController::getActiveGames() enter");
		$games = array();
		
		$query = "SELECT id FROM " . Game::TABLENAME . " WHERE year < last_year";

		$rows = getDatabase()->all($query);
		foreach ($rows as $row) {
			array_push($games, new Game($row));	
		}
		
		error_log("AdminController::getActiveGames() exit");
		return $games;
	}
	
	    public static function getCompletedGames() {
		$games = self::fetchCompletedGameArray();
		AdminController::printHeader();
		self::printMenu();
		echo "<ul>\n";
		foreach ($games as $game) {
			echo "<li><a href='" . $game->id . "'>GAME #" . $game->id . "</a></li>\n";
		}
		echo "</ul>\n";
	}

	public static function fetchCompletedGameArray() {
		error_log("AdminController::fetchCompletedGameArray() enter");
		$games = array();
		
		$query = "SELECT id FROM " . Game::TABLENAME . " WHERE year >= last_year";

		$rows = getDatabase()->all($query);
		foreach ($rows as $row) {
			array_push($games, new Game($row));	
		}
		
		error_log("AdminController::fetchCompletedGameArray() exit");
		return $games;
	}
	
	static public function saveNewGame() {
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
        header("Location: " . AdminController::getAdminDir() . "/games");
    }
	
	public static function getGame($game_id) {
		error_log("AdminGameController::getGame() enter with " . $game_id);
		
		$game = self::fetchGame($game_id);
//		error_log("GAME: " . print_r($game, true));
		
		AdminController::printHeader();
		self::printMenu();
		getTemplate()->display('admin.game.tmpl.php', array('game' => $game));
	}

    public static function fetchGame($game_id) {
		error_log("AdminController::fetchGame() enter with " . $game_id);
		if ( ! $game_id ) {
			throw new Exception("Need a game id");
		}
		
		$query = "SELECT * FROM " . Game::TABLENAME . " WHERE id = :id";
		$params = array(id => $game_id);

		$row = getDatabase()->one($query, $params);
		$game = new Game($row);
		$game->fetchSecurities();
		$game->fetchPlayers();
		
		if ( ! $game->id ) {
			throw new Exception("Game is not found");
		}
		
		error_log("AdminController::fetchGame() exit");
		return $game;
    }

    static public function processOrders($game_id) {
   		$game = getGame($game_id);
    	$game->setDebug();
   	    $game->processAllOrders();
   	    header("Location: " . AdminController::getAdminDir() . "/games/" . $game->id);
    }
    
    static public function deleteGame($game_id) {
    	$user = UserController::getLoggedInUser();
    	if ( $user->isAdmin() ) {
    		$query = "delete from " . Player::TABLENAME . " where game_id=:game_id";
    		getDatabase()->execute($query, array(game_id => $game_id));

	    	$query = "delete from " . Transaction::TABLENAME . " where game_id=:game_id";
    		getDatabase()->execute($query, array(game_id => $game_id));
    	
	    	$query = "delete from " . Order::TABLENAME . " where game_id=:game_id";
    		getDatabase()->execute($query, array(game_id => $game_id));
    	
    		$query = "delete from " . Game::GAME_SECURITY_PRICE_TABLENAME . " where game_id=:game_id";
    		getDatabase()->execute($query, array(game_id => $game_id));
    	
	    	$query = "delete from " . Portfolio::TABLENAME . " where game_id=:game_id";
	    	getDatabase()->execute($query, array(game_id => $game_id));
	    	
	    	$query = "delete from " . Game::TABLENAME . " where id=:game_id";
	    	getDatabase()->execute($query, array(game_id => $game_id));
	    		    	
//	    	return "Game " . $game_id . " deleted";
    	} else {
    		http_response_code(401);
    		return;
    	}
    	header("Location: " . AdminController::getAdminDir() . "/games");
    }
	

}