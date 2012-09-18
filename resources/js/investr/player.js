function Player(player, game) {
	var self = this;
	self.game = game;

	self.user_id = player.user_id;

	self.username = player.username;
	
	self.balance = ko.observable(parseInt(player.balance));

	self.balanceFmt = ko.computed(function() {
		return accounting.formatMoney(self.balance());
	});

	self.portfolio = ko.observableArray();
	$.each(player.portfolio, function() {
		self.portfolio.push(new Holding(this, self.game));
	});

	self.transactions = ko.observableArray($.map(player.transactions, function(txn) {
		return new Transaction(txn);
	}));
	
	self.portf_worth = ko.observable(player.portf_worth);
	
	self.netWorthFmt = ko.computed(function() {
		return accounting.formatMoney(parseInt(self.balance()) + parseInt(self.portf_worth()));
	});

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
