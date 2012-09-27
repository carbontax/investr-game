<?php
class Security {
    const TABLENAME = "security";

    public $security_id;
    public $name;
    public $symbol;
    public $description;
    public $dividend;
    public $dividend_label;
    public $outstanding;
    public $split;
    public $price;
    public $delta; // latest price change

    public function __construct($security = array()) {
        $this->security_id = $security['security_id'];
        $this->name = $security['name'];
        $this->symbol = $security['symbol'];
        $this->description = $security['description'];
        $this->dividend = $security['dividend'];
        $this->dividend_label = $security['dividend_label'];
        $this->outstanding = $security['outstanding'];
        $this->price = $security['price'];
        $this->split = $security['split'];
        $this->delta = $security['delta'];
    }
    
    public static function fetchIdForSymbol($symbol) {
    	$query = "SELECT id from " . self::TABLENAME . " where symbol = :symbol";
    	$params = array(symbol => $symbol);
    	$row = getDatabase()->one($query, $params);
    	return $row['id'];
    }
}