<?php
class ChanceEvent {
    const TABLENAME = "chance_event";
    const BEAR_MARKET = 0;
    const BULL_MARKET = 1;
    
    public $id;
    public $game_id;
    public $year;
    public $die_one;
    public $die_two;
    public $market;
    public $card_id;

    public function __construct($die_event = array()) {
        $this->id = $die_event['id'];
        $this->game_id = $die_event['game_id'];
        $this->year = $die_event['year'];
        $this->die_one = $die_event['die_one'];
        $this->die_two = $die_event['die_two'];
        $this->market = $die_event['market'];
        $this->card_id = $die_event['card_id'];
    }

    public function save() {
        $query = "INSERT INTO " . self::TABLENAME . 
            " (game_id, year, die_one, die_two, market, card_id) " .
            " values (:game_id, :year, :die_one, :die_two, :market, :card_id) ";
        $result = getDatabase()->execute($query, array(game_id => $this->game_id,
            year => $this->year,
            die_one => $this->die_one,
            die_two => $this->die_two,
            market => $this->market,
            card_id => $this->card_id));

        return $result;
    }

    public function createValues() {
        $this->die_one = mt_rand(1,6);
        $this->die_two = mt_rand(1,6);
        $this->market = mt_rand(0,1);
        // TODO pick a random event card
    }

    public function diceValue() {
        return $this->die_one + $this->die_two;
    }
}