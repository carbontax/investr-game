/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Game: false*/
(function($, ko) {
	module('investr#game_standalone', {
	});

	test('can create new empty game', 2, function() {
		var game = new Game();
		ok(game, 'It should be possible to create an empty game');
		equal(game.disableStandButton(), true, 'Stand button should be disabled by default');
	});

	test('can create a game with an empty object', 2, function() {
		var game = new Game({});
		ok(game, 'Should create a game with no data');
		equal(game.disableStandButton(), true, 'Stand button should be disabled by default');
	});

	test('Can create game with no players', 2, function() {
		var game = new Game({id: 1, players: []});
		ok(game, 'Game is ok');
		equal(game.disableStandButton(), true, 'Stand button should be disabled by default');
	});
	
	test('Can create game with no orders', 2, function() {
		var data = {id: 1, orders: []};
		var game = new Game(data);
		ok(game, 'Game is ok');
		equal(game.disableStandButton(), true, 'Stand button should be disabled by default');
	});
	
	test('Create game for 1 player', 1, function() {
		var data = {id: 1, number_of_players: 1};
		var game = new Game(data);
		equal(game.number_of_players(), 1, 'Should be a solo game.');		
	});
	
	test('Create full game for 1 player', 3, function() {
		var data = {id: 1, number_of_players: 1, players: [{}]};
		var game = new Game(data);
		ok(game, "Should be a valid game");
		equal(game.number_of_players(), 1, 'Should be a solo game.');
		equal(game.playerCount(), 1, "Game should have one player");
	});
	
	module('investr#game_2players', {
		setup: function() {
			this.players_json = [{user_id: '1', username: 'player_one', rank: '2'},{user_id: '2', username: 'player_two', rank: '1'}];
			this.game_json = {id: 1, number_of_players: 2, players: this.players_json};
		}
	});
	
	test('Player count', 2, function() {
		var game = new Game(this.game_json);
		ok(game,"Should be a valid game");
		equal(game.playerCount(), 2, "Game should have two players");
	});
	
	test('First place awarded', 1, function() {
		var game = new Game(this.game_json);
		equal(game.getFirstPlacePlayer().user_id, 2, "Player 2 should be in first place");
	});
	
	module('investr#game_year', {
		setup: function() {
			this.game = new Game({'last_year': 10});
		}
	});
	
	test('Game is not over', 2, function() {
		this.game.year(1);
		ok(this.game.hasNextYear(), "Game has 9 more years to go");
		this.game.year(9);
		ok(this.game.hasNextYear(), "Game has 1 more year to go");
	});
	
	test('Game is over', 1, function() {
		this.game.year(10);
		equal(this.game.hasNextYear(), false, "Game is over");
	});
	
	module('investr#game_securities', {
		setup: function() {
			this.securities = [{"security_id":"1","name":"AAA Corporation","symbol":"AAA","description":"Blue chip stock. Reliable growth with low risk","dividend":"1","dividend_label":"Dividend","outstanding":"600","split":"0","price":"145","delta":"11","bust":null},
	{"security_id":"2","name":"BBB Realty","symbol":"BBB","description":"Moderate risk","dividend":"0","dividend_label":"Dividend","outstanding":"1200","split":"2","price":"81","delta":"18","bust":null},
	{"security_id":"3","name":"CCC Equity Fund","symbol":"CCC","description":"Income stock. Moderate risk.","dividend":"4","dividend_label":"Dividend","outstanding":"600","split":"0","price":"135","delta":"14","bust":null},
	{"security_id":"4","name":"DDD Income Trust","symbol":"DDD","description":"Income stock. Low growth with moderate risk.","dividend":"7","dividend_label":"Dividend","outstanding":"481","split":"0","price":"112","delta":"22","bust":null},
	{"security_id":"5","name":"EE Exploration","symbol":"EEE","description":"Speculative. Very high risk, high reward.","dividend":"0","dividend_label":"Dividend","outstanding":"206","split":"0","price":"114","delta":"67","bust":null},
	{"security_id":"6","name":"FFF Bus Company","symbol":"FFF","description":"Moderate risk","dividend":"0","dividend_label":"Dividend","outstanding":"1200","split":"2","price":"79","delta":"15","bust":null},
	{"security_id":"7","name":"GGG Motors","symbol":"GGG","description":"Moderate risk","dividend":"2","dividend_label":"Dividend","outstanding":"1200","split":"0","price":"109","delta":"22","bust":null},
	{"security_id":"8","name":"HHH Mining & Smelting","symbol":"HHH","description":"Income. Moderate risk","dividend":"6","dividend_label":"Dividend","outstanding":"560","split":"0","price":"121","delta":"18","bust":null},
	{"security_id":"9","name":"III Utilities","symbol":"III","description":"Moderate risk","dividend":"3","dividend_label":"Dividend","outstanding":"600","split":"0","price":"147","delta":"13","bust":null}];
		}
	});
	
	test('Create game with securities', 1, function() {
		var game = new Game({id: 1, securities: this.securities});
		ok(game);
	});
	
}(jQuery, ko));
