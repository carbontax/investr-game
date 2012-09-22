<?php
class OrdersController
{
    static public function apiPostOrders($game_id) {
        $game = GameController::apiGame($game_id);

        $stream = file_get_contents('php://input');
        $orders = json_decode($stream, true);

        /* 
         * if these orders are for the last player the game 
         * year will be ended and all orders processed.
         */
        $results = $game->addOrders($orders);

        return $results;
    }
}
