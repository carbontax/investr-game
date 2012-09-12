function Order(order) {
	var self = this;

	/* == ACTIONS == */
	self.actionOptions = ['BUY', 'SELL'];
	self.action = ko.observable('BUY');
	if (order) {
		self.action(order.action);
	}
	self.actionFactor = ko.computed(function() {
		if ( self.action() === 'BUY' ) {
			return 1;
		}
		return -1;
	});

	/* == SECURITY == */
	self.security = ko.observable();
	// for saved orders only
	if ( order ) {
		self.security(order.security);
	}

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

	/* == SHARES == */
	self.shares = ko.observable();
	if ( order ) {
		self.shares(order.shares);
	}
	self.sharesDelta = ko.computed(function() {
		return Number(self.shares()) * self.actionFactor();
	});

	/* == MARGIN == */
	self.margin = ko.observable();
	if ( order && order.margin ) {
		self.margin(order.margin);
	}

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
};