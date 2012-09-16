<?php
include_once '../epiphany/src/Epi.php';
include_once 'lib/utils.php';
include_once 'lib/constants.class.php';
include_once 'models/user.class.php';
include_once 'models/player.class.php';
include_once 'models/portfolio.class.php';
include_once 'models/order.class.php';
include_once 'models/security.class.php';
include_once 'models/transaction.class.php';
include_once 'models/chance_event.class.php';
include_once 'models/game.class.php';

include_once 'controllers/user.class.php';
include_once 'controllers/login.class.php';
include_once 'controllers/player.class.php';
include_once 'controllers/order.class.php';
include_once 'controllers/game.class.php';
Epi::setSetting('exceptions', true);
Epi::setPath('base', '../epiphany/src');
Epi::init('api', 'session', 'database', 'config');

Epi::setPath('config', 'etc');
getConfig()->load('config.ini');

EpiDatabase::employ(getConfig()->get('dbtype'), 
  getConfig()->get('dbname'),
  getConfig()->get('dbhost'),
  getConfig()->get('dbuser'),
  getConfig()->get('dbpassword'));
// call session_start before any headers are sent.
getSession();

getApi()->get('/version', 'apiVersion', EpiApi::external);
getApi()->get('/login', array('LoginController', 'apiGetLogin'), EpiApi::external);
getApi()->post('/login', array('LoginController', 'apiPostLogin'), EpiApi::external);
getApi()->post('/logout', array('LoginController', 'processLogout'), EpiApi::external);

getApi()->get('/users', array('UserController', 'apiUsers'), EpiApi::external);

getApi()->get('/games', array('GameController', 'apiGames'), EpiApi::external);
getApi()->get('/games/(\d+)', array('GameController', 'apiGame'), EpiApi::external);
getApi()->get('/games/new', array('GameController', 'apiGetNewGame'), EpiApi::external);
getApi()->get('/games/new/list', array('GameController', 'apiNewGames'), EpiApi::external);
getApi()->post('/games', array('GameController', 'apiPostNewGame'), EpiApi::external);
getApi()->post('/games/(\d+)/join', array('GameController', 'apiGameJoin'), EpiApi::external);
getApi()->post('/games/(\d+)/orders', array('OrdersController', 'apiPostOrders'), EpiApi::external);
// devel only
getApi()->get('/games/(\d+)/proc', array('GameController', 'apiGameProcessOrders'), EpiApi::external);
getApi()->get('/games/(\d+)/del', array('GameController', 'apiGameDelete'), EpiApi::external);
getApi()->get('/games/(\d+)/div', array('GameController', 'apiGamePayDividends'), EpiApi::external);

getRoute()->run();

function apiVersion() {
  return array('version' => '0.0.1');
}
