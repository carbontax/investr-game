<?php

class Model {
	protected $debug;
	
	public function __construct($debug = false) {
		$this->debug = $debug;
	}
	
	public function setDebug($debug = true) {
		$this->debug = $debug;
	}
}