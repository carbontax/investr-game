function Security(security) {
	"use strict";
	var self = this;
	
	self.security_id = null;
	self.symbol = null;
	self.name = null;
	self.dividend = null;
	self.price = ko.observable();
	self.priceHistory = ko.observableArray();
	self.outstanding = ko.observable();
	self.delta = ko.observable();
	self.split = ko.observable();
	self.description = null;
	self.showDetail = ko.observable(false);

	self.priceFmt = ko.computed(function() {
		return accounting.formatMoney(self.price());
	});

	self.deltaFmt = ko.computed(function() {
		if (self.delta() ) {
			var prefix = "";
			if ( Number(self.delta()) >= 0 ) {
				prefix = "+";
			}
			return prefix + self.delta();
		}
	});

	self.isUp = ko.computed(function() {
		if ( Number(self.delta()) >= 0 ) {
			return true;
		}
		return false;
	});

	self.isDown = ko.computed(function() {
		if ( Number(self.delta()) < 0 ) {
			return true;
		}
		return false;
	});
}

Security.prototype.loadSecurity = function(security) {
	var self = this;
	self.security_id = security.security_id;
	self.symbol = security.symbol;
	self.name = security.name;
	self.dividend = security.dividend;
	self.price(security.price);
	self.priceHistory.push(security.priceHistory);
	self.outstanding(Number(security.outstanding));
	self.delta(security.delta);
	self.split(Number(security.split));
	if ( security.description ) {
		self.description = security.description;
	}
};

Security.prototype.toggleShowDetail = function() {
	var self = this;
	if ( self.showDetail() ) {
		self.showDetail(false);
	} else {
		self.showDetail(true);
	}
};

Security.prototype.dividendLabel = function() {
	if ( this.symbol === 'BND' ) {
		return "Interest:";
	}
	return "Dividend:";
};

Security.prototype.dividendFmt = function() {
	var self = this, d = "NO YIELD";
	if ( self.dividend > 0 ) {
		d = accounting.formatMoney(self.dividend);
	}
	return d;
};

