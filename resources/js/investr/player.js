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
	self.portfolioNetWorthFmt = ko.computed(function() {
		var portfNetWorth = 0;
		$.each(self.portfolio(), function() {
			portfNetWorth += this.marketValue();
		});
		return accounting.formatMoney(portfNetWorth);
		
	});
	
	self.portfolioIncomeFmt = ko.computed(function() {
		var portfIncome = 0;
		$.each(self.portfolio(), function() {
			portfIncome += this.income();
		});
		return accounting.formatMoney(portfIncome);
	});
	
	self.netWorthFmt = ko.computed(function() {
		return accounting.formatMoney(parseInt(self.balance()) + parseInt(self.portf_worth()));
	});
	
	self.has_ordered = ko.observable(false);
	if ( player.has_ordered ) {
		self.has_ordered(player.has_ordered);
	}

	self.hasNoOrders = ko.computed(function(){
		return ! self.has_ordered();
	});

	self.orders = ko.observableArray();

	self.loadOrders = function(orders) {
		self.orders([]);
		$.map(orders, function(order) {
			//log.info("order = " + order);
			var security = ko.utils.arrayFilter(game.securities(), function(s) {
				return s.symbol === order.security_symbol;
			})[0];
			order.security = security;

			self.orders.push(new Order(order));
		});
		if ( self.orders().length > 0 ) {
			self.has_ordered(true);
		}
	}
	
	if ( player.orders ) {
		// other players in the game will not have visible orders
		self.loadOrders(player.orders);
	}
	
	self.rank = ko.observable(parseInt(player.rank));
	self.firstPlace = ko.computed(function() {
		return self.rank == 1;
	});
}
