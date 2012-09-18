function Player(player, game) {
	var self = this;
	self.game = game;

	self.user_id = player.user_id;

	self.username = player.username;
	
	self.balance = ko.observable(parseInt(player.balance));

	self.balanceFmt = ko.computed(function() {
		return accounting.formatMoney(self.balance());
	});

	// Build a hash table of currently held shares
/*	self.portfolioMap = {};
	$.each(player.portfolio, function(i, holding) {
		var dummy = 'foo';
		self.portfolioMap[holding.security_symbol] = holding.shares;
	}); */

	self.portfolio = ko.observableArray();
	$.each(player.portfolio, function() {
		self.portfolio.push(new Holding(this, self.game));
	});
//	if (game && game.securities() && game.securities().length > 0 ) {
//		$.each(game.securities(), function(s) {
//			var h = new Holding(s.symbol, self.game);
//			h.shares += self.portfolioMap[s.symbol] ? self.portfolioMap[s.symbol] : 0;
//			self.portfolio.push(h);
//		});
//	}

	self.transactions = ko.observableArray($.map(player.transactions, function(txn) {
		return new Transaction(txn);
	}));

	self.orders = ko.observableArray();

	self.loadOrders = function(orders) {
		self.orders([]);
		$.map(orders, function(order) {
			log.info("order = " + order);
			var security = ko.utils.arrayFilter(game.securities(), function(s) {
				return s.symbol === order.security_symbol;
			})[0];
			order.security = security;

			self.orders.push(new Order(order));
		});
		
	}
	
	if ( player.orders ) {
		// other players in the game will not have visible orders
		self.loadOrders(player.orders);
	}

	self.hasNoOrders = function() {
		if ( self.orders() && self.orders().length > 0 ) {
			return false;
		}
		return true;
	}

}
