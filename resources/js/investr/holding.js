function Holding(holding, securities) {
	"use strict";
	var self = this;

	self.symbol = null; 
	self.shares = null;
	self.security = null;

	if ( holding ) {
		self.loadHolding(holding);
	}
	if ( securities ) {
		self.lookupSecurity(securities);
	}
	// === COMPUTED === //
	
	self.marketValue = ko.computed(function() {
		if ( ! self.security ) {
			return 0;
		}
		return self.security.price() * self.shares;
	});
	
	self.marketValueFmt = ko.computed(function() {
		return accounting.formatMoney(self.marketValue());
	});
}

Holding.loadHolding = function (holding) {
	var self = this;
	if ( typeof(holding) === 'string' ) {
		holding = {'security_symbol': holding, 'shares': 0};
	}
	self.symbol = holding.security_symbol;
	self.shares = holding.shares;
};

Holding.prototype.income = function() {
	var self = this;
	if ( ! self.security ) {
		return 0;
	}
	return self.security.dividend * self.shares;
};

Holding.prototype.incomeFmt = function() {
	return accounting.formatMoney(this.income());
};

Holding.prototype.lookupSecurity = function(securities) {
	var self = this;
	var security = ko.utils.arrayFilter(securities, function(s) {
		return s.symbol === self.symbol;
	})[0];
	return security;
};
