function Player(player, game) {
	var self = this;
	self.game = game;

	self.id = player.id;

	self.username = player.username;
	
	self.balance = ko.observable(parseInt(player.balance));

	self.balanceFmt = ko.computed(function() {
		return accounting.formatMoney(self.balance());
	});

	// Build a hash table of currently held shares
	self.portfolioMap = {};
	$.each(player.portfolio, function(i, holding) {
		var dummy = 'foo';
		self.portfolioMap[holding.security_symbol] = holding.shares;
	});

	self.portfolio = $.map(game.securities(), function(s) {
		var h = new Holding(s.symbol, self.game);
		h.shares += self.portfolioMap[s.symbol] ? self.portfolioMap[s.symbol] : 0;
		return h;
	});

	self.transactions = ko.observableArray($.map(player.transactions, function(txn) {
		return new Transaction(txn);
	}));

	self.orders = ko.observableArray();

	if ( player.orders ) {
		// other players in the game will not have visible orders
		$.map(player.orders, function(order) {
			log.info("order = " + order);
			var security = ko.utils.arrayFilter(game.securities(), function(s) {
				return s.symbol === order.security_symbol;
			})[0];
			order.security = security;

			self.orders().push(new Order(order));
		});
	}

	self.hasNoOrders = function() {
		if ( self.orders() && self.orders().length > 0 ) {
			return false;
		}
		return true;
	}

}
