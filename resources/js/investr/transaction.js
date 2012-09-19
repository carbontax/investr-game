function Transaction(transaction) {
	var self = this;

	self.player = transaction.player;
	self.index = transaction.index || 0;
	self.year = transaction.year;
	self.action = transaction.action;
	self.security_id = transaction.security_id;
	self.security_symbol = transaction.security_symbol;
	self.shares = transaction.shares;
	self.pricePerShare = transaction.price;
	self.amount = transaction.amount;
	self.balance = transaction.balance;
	self.income = transaction.income;
	self.margin = transaction.margin;
	self.comment = transaction.comment;
/*	if ( typeof transaction === "number" ) {
		// $.map() treats an object with a single property as the value itself
		self.balance = transaction;
	} else {
		self.balance = transaction.balance;
	}*/
	self.marginTotal = transaction.marginTotal;

	self.securityName = ko.computed(function() {
		return self.symbol ? self.symbol : "";
	});

	self.pricePerShareFmt = ko.computed(function() {
		if (self.pricePerShare) {
			return accounting.formatMoney(self.pricePerShare);
		} else {
			return "";
		}
	});

	self.amountFmt = ko.computed(function() {
		if ( self.amount ) {
			return accounting.formatMoney(self.amount);
		}
	});

	self.incomeFmt = ko.computed(function() {
		if ( self.income ) {
			return accounting.formatMoney(self.income);
		}
	});

	self.marginAmountFmt = ko.computed(function() {
		return self.margin ? accounting.formatMoney(self.margin) : "";
	});

	self.balanceFmt = ko.computed(function() {
		if ( self.balance ) {
			return accounting.formatMoney(self.balance);
		}
	});

	self.marginTotalFmt = ko.computed(function() {
		if ( self.marginTotal ) {
			return accounting.formatMoney(self.marginTotal);
		}
	});

};