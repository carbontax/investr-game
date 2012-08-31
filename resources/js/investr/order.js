function Order() {
	var self = this;

	/* == ACTIONS == */
	self.actions = ['BUY', 'SELL'];
	self.selectedAction = ko.observable('BUY');
	self.actionFactor = function() {
		if ( self.selectedAction() === 'BUY' ) {
			return -1;
		}
		return 1;
	};

	/* == SECURITY == */
	self.security = ko.observable();

	self.pricePerShareFmt = ko.computed(function() {
		var price = "";
		if ( self.security() ) {
		 	price = accounting.formatMoney(self.security().price());
		}
		return price;
	});

	/* == SHARES == */
	self.shares = ko.observable();

	/* == MARGIN == */
	self.margin = ko.observable();

	/* == AMOUNT CALCULATION == */
	self.amount = ko.computed(function() {
		// TODO allow for margin calculations
		if ( self.security() && self.shares() ) {
			return self.security().price() * self.shares() * self.actionFactor();
		}
	});

	self.amountFmt = ko.computed(function() {
		return accounting.formatMoney(self.amount());
	});
};