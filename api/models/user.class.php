<?php
include_once('base.class.php');

class User extends Model {
	const TABLENAME = "users";
	
    public $id;
    public $username;
    public $email;
    public $games;
    public $activeGames;
    public $newGames;

    public function __construct($user = array()) {
        $this->id = $user['id'];
        $this->username = $user['username'];
        $this->email = $user['email'];

//        $this->activeGames = GameController::apiActiveGames();
//        $this->newGames = GameController::apiNewGames();
    }

	public function isAdmin() {
		$query = "select 1 from user_role ur join role r on ur.role_id = r.id where r.role like 'admin' and ur.user_id = :user_id";
		$params = array(user_id => $this->id);
		//log_query($query, $params);
		$row = getDatabase()->one($query, $params);
		return count($row) > 0;
	}
	
	public function fetchGames() {
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
		$this->debug && query_log($query, $params, "User.fetchGames()");
        $result = getDatabase()->all($query,$params);

        if ( $result !== false ) {
            foreach ($result as $key => $game) {
                array_push($this->games, new Game($game));
            }
        }
	}
}