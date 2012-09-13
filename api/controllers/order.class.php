<?php
class OrdersController
{
    static public function apiPostOrders($game_id) {
        $game = GameController::apiGame($game_id);

        $stream = file_get_contents('php://input');
        $orders = json_decode($stream, true);

        $results = $game->addOrders($orders);

        return $results;
    }
}
