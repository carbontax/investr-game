function Transaction(transaction) {
	"use strict";
	var self = this;

	self.player = null;
	self.index = null;
	self.year = null;
	self.action = null;
	self.security_id = null;
	self.security_symbol = null;
	self.shares = null;
	self.pricePerShare = null;
	self.amount = null;
	self.balance = null;
	self.income = null;
	self.margin = null;
	self.invalid = null;
	self.comment = null;
	self.marginTotal = null;

	if ( transaction ) {
		self.loadTransaction(transaction);
	}
	// === COMPUTED === //
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

}

Transaction.prototype.loadTransaction = function(transaction) {
	this.player = transaction.player;
	this.index = transaction.index || 0;
	this.year = transaction.year;
	this.action = transaction.action;
	this.security_id = transaction.security_id;
	this.security_symbol = transaction.security_symbol;
	this.shares = transaction.shares;
	this.pricePerShare = transaction.price;
	this.amount = transaction.amount;
	this.balance = transaction.balance;
	this.income = transaction.income;
	this.margin = transaction.margin;
	this.invalid = transaction.invalid;
	this.comment = transaction.comment;
	this.marginTotal = transaction.marginTotal;
};

Transaction.prototype.symbolAtPrice = function() {
	var self = this;
	if ( self.pricePerShare ) {
		return self.security_symbol + ' @ $' + self.pricePerShare;
	}
	return self.security_symbol;
};

