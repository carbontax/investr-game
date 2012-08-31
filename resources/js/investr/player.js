function Player(player, game) {
	var self = this;
	self.game = game;

	self.username = player.username;
	
	// self.portfolio = ko.observableArray($.map(player.portfolio, function(h) {
	// 		return new Holding(h, self.game);
	// }));

	// Build a hash table of currently held shares
	self.portfolioMap = {};
	$.each(player.portfolio, function(i, holding) {
		self.portfolioMap[holding.symbol] = holding.shares;
	});

	self.portfolio = $.map(game.securities(), function(s) {
		var h = new Holding(s.symbol, self.game);
		h.shares += self.portfolioMap[s.symbol] ? self.portfolioMap[s.symbol] : 0;
		return h;
	});

	self.transactions = ko.observableArray($.map(player.transactions, function(txn) {
		return new Transaction(txn);
	}));
	
	self.balance = player.balance;

	// self.addOrder = function(order) {
	// 	var success = false;
	// 	$.map(self.portfolio(), function(h) {
	// 		if ( h.symbol === order.symbol ) {
	// 			h.shares += order.shares;
	// 			success = true;
	// 			break;
	// 		}
	// 	});
	// 	if ( ! success ) {
	// 		self.portfolio.push(new Holding(order, self.game));
	// 	}
	// }

/*	self.lastTxnIdx = function() {
		return self.transactions() && self.transactions().length ? self.transactions().length - 1 : 0;
	};

	self.lastTransaction = function() {
		return self.transactions()[self.lastTxnIdx()];
	}

	self.balance = ko.computed(function() {
		return self.lastTransaction().balance;
	});

	self.marginTotal = ko.computed(function(){
		return self.lastTransaction().marginTotal;
	});

	self.netWorth = ko.computed(function() {
		// TODO
		return 5000;
	}); */

}
