/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Game: false, Player: false, Security: false */
(function($, ko) {
	module('investr#empty_player', {
	});

	test('can create new empty player', 1, function() {
		var player = new Player();
		ok(player, 'It should be possible to create an empty player');
	});

	test('can create a player with an empty object', 1, function() {
		var data = {};
		var player = new Player(data, this.game);
		ok(player, 'Should create a player with no data');
	});
	
	module('investr#player_with_empty_game', {
		setup: function() {
			this.game = new Game();
		}
	});

	test('Can create player with no orders', 1, function() {
		var data = {id: 1, orders: []};
		var player = new Player(data, this.game);
		ok(player, 'Player is ok');
	});
	
	module('investr#player_with_game', {
		setup: function() {
			var game_data = {
				securities: [{security_id: 1, symbol: 'AAA'}]
			};
			this.game = new Game(game_data);
			this.order_1 = {
				security_symbol: 'AAA'
			};
		}
	});

	test('Can create player with orders', 4, function() {
		var data = {id: 1, orders: [this.order_1]};
		var player = new Player(data, this.game);
		ok(player, 'Player is ok');
		equal(player.orders().length, 1, "Player should have one order");
		equal(player.has_ordered(), true, 'Player has completed current turn');
		equal(player.hasNoOrders(), false, 'Player has completed current turn');
	});
	
	test('Can create player with a stand order', 3, function() {
		var player = new Player({id: 1, has_ordered: 1}, this.game);
		ok(player);
		equal(player.has_ordered(), true, 'Player has completed current turn');
		equal(player.hasNoOrders(), false, 'Player has completed current turn');
	});
	
}(jQuery, ko));
