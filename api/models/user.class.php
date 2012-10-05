<?php
include_once('base.class.php');

class User extends Model {
	const TABLENAME = "users";
	
    public $id;
    public $username;
    public $email;
    public $games;
    public $newGames;

    public function __construct($user = array()) {
        $this->id = $user['id'];
        $this->username = $user['username'];
        $this->email = $user['email'];
    }

	public function isAdmin() {
		$query = "select 1 as admin from user_role ur join role r on ur.role_id = r.id where r.role like 'admin' and ur.user_id = :user_id";
		$params = array(user_id => $this->id);
		//log_query($query, $params);
		$row = getDatabase()->one($query, $params);
		if ( $row && array_key_exists('admin', $row) ) {
			return true;
		}
		return false;
	}
	
	public function fetchGames() {
		$this->debug && error_log("User::fetchGames()");
		$this->games = array();
        $query = 'SELECT g.id, g.start_date, g.year, g.last_year, g.number_of_players, count(o.id) ' .
            ' as turn FROM ' . Game::TABLENAME . ' g ' .
            ' JOIN ' . Player::TABLENAME . ' p ' .
            ' ON g.id = p.game_id ' .
            ' LEFT JOIN ' . Order::TABLENAME . ' o ' .
            ' ON p.user_id = :user_id AND p.user_id = o.user_id AND p.game_id = o.game_id AND o.year = g.year ' .
            ' where g.year > 0 ' . 
            ' AND g.id IN ' .
            ' (select game_id FROM player WHERE user_id = :user_id) ' .
            ' group by g.id, g.start_date, g.year, g.number_of_players order by g.id';
        $params = array('user_id' => $this->id);
		$this->debug && log_query($query, $params, "User.fetchGames()");
        $result = getDatabase()->all($query,$params);

        if ( $result !== false ) {
            foreach ($result as $game_data) {
            	$game = new Game($game_data);
            	$game->setDebug();
            	$game->fetchSettings();
            	$game->fetchPlayerSummaries();
                array_push($this->games, $game);
            }
        }
	}
	
	public function matchGameState($gamestate = "") {
		$this->debug && error_log("User::matchGameState() enter with " . $gamestate);

		$this->fetchGames();
		$gs = "";
		foreach ($this->games as $game) {
			if ( $game->isActive() ) {
				if ( $gs != "" ) { $gs .= "-"; }
				$gs .= $game->getGameState();
			}
		}
//		error_log(">>>>>>>>>>>>>>>>>>>>>>>>> " . $gs);
		$match = ($gamestate === $gs);
		$this->debug && error_log("User::matchGameState() exit with " . $match);
		return $match;
	}
}