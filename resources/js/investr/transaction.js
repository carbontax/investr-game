function Transaction(transaction) {
	var self = this;

	self.player = transaction.player;
	self.index = transaction.index || 0;
	self.year = transaction.year;
	self.action = transaction.action;
	self.security = transaction.security;
	self.numShares = transaction.numShares;
	self.pricePerShare = transaction.pricePerShare;
	self.amount = transaction.amount;
	self.income = transaction.income;
	self.marginAmount = transaction.marginAmount;
	self.balance = transaction.balance;
	self.marginTotal = transaction.marginTotal;

	self.securityName = ko.computed(function() {
		return self.security ? self.security.name : "";
	});

	self.pricePerShareFmt = ko.computed(function() {
		return accounting.formatMoney(self.pricePerShare);
	});

	self.amountFmt = ko.computed(function() {
		return accounting.formatMoney(self.amount);
	});

	self.incomeFmt = ko.computed(function() {
		return accounting.formatMoney(self.income);
	});

	self.marginAmountFmt = ko.computed(function() {
		return accounting.formatMoney(self.marginAmount);
	});

	self.balanceFmt = ko.computed(function() {
		return accounting.formatMoney(self.balance);
	});

	self.marginTotalFmt = ko.computed(function() {
		return accounting.formatMoney(self.marginTotal);
	});

};