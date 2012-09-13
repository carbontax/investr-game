<?php
class PlayerController
{
    static public function dummyListAll() {
        $googalan = array(
                  'username' => 'googalan', 
                  'balance' => 5000,
                  'portfolio' => array(array(symbol => 'GRO', shares => 25), array(symbol => 'SHB', shares => 20)), 
                  'transactions' => array('balance' => 5000));
        $carbontax = array(
                  'username' => 'carbontax', 
                  'balance' => 5000,
                  'portfolio' => array(), 
                  'transactions' => array('balance' => 5000));
        $peppercorn = array(
                  'username' => 'peppercorn', 
                  'balance' => 5000,
                  'portfolio' => array(), 
                  'transactions' => array('balance' => 5000));
        $nsmithlea = array(
                  'username' => 'nsmithlea', 
                  'balance' => 5000,
                  'portfolio' => array(), 
                  'transactions' => array('balance' => 5000));

        return array(
            new Player($carbontax), 
            new Player($googalan),
            new Player($peppercorn),
            new Player($nsmithlea));
    }

    public static function getDummyPlayer($username) {
        $player = null;
        foreach ( self::dummyListAll() as $p ) {
            if ( $p->username === $username ) {
                $player = $p;
                break;
            }
        }
        return $player;
    }

}