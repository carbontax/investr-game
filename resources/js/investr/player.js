function Player(player) {
	var self = this;

	self.username = player.username;
	self.portfolio = player.portfolio;
	self.transactions = ko.observableArray($.map(player.transactions, function(txn) {
		return new Transaction(txn);
	}));

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
