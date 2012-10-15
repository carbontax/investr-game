function Order(order) {
	"use strict";
	var self = this;

	/* == ACTIONS == */
	self.actionOptions = ['BUY', 'SELL'];
	self.action = ko.observable('BUY');
	
	self.actionFactor = ko.computed(function() {
		if ( self.action() === 'BUY' ) {
			return 1;
		}
		return -1;
	});
	self.comment = ko.observable();

	/* == SECURITY == */
	self.security = ko.observable();
	
	self.security_id = ko.computed(function() {
		return self.security() ? self.security().security_id : null;
	});

	self.security_symbol = ko.computed(function() {
		return self.security() ? self.security().symbol : null;
	});

	self.pricePerShareFmt = ko.computed(function() {
		var price = "";
		if ( self.security() ) {
			price = accounting.formatMoney(self.security().price());
		}
		return price;
	});
	
	self.securityAtPrice = ko.computed(function() {
		if ( self.security() ) {
			return self.security_symbol() + " @ " + self.pricePerShareFmt();
		}
		return "";
	});

	/* == SHARES == */
	self.shares = ko.observable();
	self.sharesDelta = ko.computed(function() {
		return Number(self.shares()) * self.actionFactor();
	});

	/* == MARGIN == */
	self.margin = ko.observable();
	
	/* == INVALID == */
	self.invalid = ko.observable();
	self.isInvalid = ko.computed(function() {
		return self.invalid() + 0 > 0;
	});

	/* == AMOUNT CALCULATION == */
	self.amount = ko.computed(function() {
		// TODO allow for margin calculations
		if ( self.security() && self.shares() ) {
			return self.security().price() * Number(self.shares()) * self.actionFactor() * -1;
		}
	});

	self.amountFmt = ko.computed(function() {
		return accounting.formatMoney(self.amount());
	});
	
	self.blur = function() {
		return false;
	};
	
	self.loadOrder = function(order) {
		self.action(order.action);
		self.comment(order.comment);
		self.security(order.security);
		self.shares(order.shares);
		self.margin(order.margin);
		self.invalid(order.invalid);
	};

	if (order) {
		self.loadOrder(order);
	}
	
}