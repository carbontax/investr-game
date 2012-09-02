function Player(player, game) {
	var self = this;
	self.game = game;

	self.username = player.username;
	
	// Build a hash table of currently held shares
	self.portfolioMap = {};
	$.each(player.portfolio, function(i, holding) {
		var dummy = 'foo';
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
}
