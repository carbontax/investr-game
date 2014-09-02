<?php
include_once '../../epiphany/src/Epi.php';
include_once '../lib/utils.php';
include_once '../lib/constants.class.php';
include_once '../models/user.class.php';
include_once '../models/player.class.php';
include_once '../models/portfolio.class.php';
include_once '../models/order.class.php';
include_once '../models/security.class.php';
include_once '../models/transaction.class.php';
include_once '../models/chance_event.class.php';
include_once '../models/game.class.php';

include_once 'controllers/admin.cntl.class.php';
include_once 'controllers/admin.game.cntl.class.php';
include_once 'controllers/admin.user.cntl.class.php';
include_once '../controllers/user.class.php';
include_once '../controllers/login.class.php';

Epi::setSetting('exceptions', true);
Epi::setPath('base', '../../epiphany/src');
Epi::init('api', 'session', 'database', 'config', 'template');

Epi::setPath('view', 'templates');
Epi::setPath('config', '../etc');
getConfig()->load('config.ini');

EpiDatabase::employ(getConfig()->get('dbtype'), 
  getConfig()->get('dbname'),
  getConfig()->get('dbhost'),
  getConfig()->get('dbuser'),
  getConfig()->get('dbpassword'));
// call session_start before any headers are sent.
getSession();

getRoute()->get('/', array('AdminController', 'home'));
// LIST USERS
getRoute()->get('/users', array('AdminUserController', 'fetchAllUsers'), EpiApi::external);
// LIST GAMES
// getRoute()->get('/games', array('AdminGameController', 'getGames'));
getRoute()->get('/games/active', array('AdminGameController', 'fetchActiveGameArray'), EpiApi::external);
getRoute()->get('/games/completed', array('AdminGameController', 'fetchCompletedGameArray'), EpiApi::external);
// INDIVIDUAL GAME ACTIONS
getRoute()->post('/games', array('AdminGameController', 'saveNewGame'));

getRoute()->get('/games/(\d+)', array('AdminGameController', 'getGame'));
getRoute()->post('/games/(\d+)/proc', array('AdminGameController', 'processOrders'));
getRoute()->post('/games/(\d+)/del', array('AdminGameController', 'deleteGame'));

getRoute()->run();

function apiVersion() {
  return array('version' => '0.0.1');
}
