function Security(security) {
	var self = this;

	self.security_id = security.security_id;
	self.symbol = security.symbol;
	self.name = security.name;
	self.dividend = security.dividend;
	self.price = ko.observable(security.price);
	self.priceHistory = ko.observableArray(security.priceHistory)
	self.outstanding = ko.observable(security.outstanding);
	self.delta = ko.observable(security.delta);
	self.split = ko.observable(parseInt(security.split));
	
	self.showDetail = ko.observable(false);
	self.toggleShowDetail = function() {
		if ( self.showDetail() ) {
			self.showDetail(false);
		} else {
			self.showDetail(true);
		}
	};

	self.priceFmt = ko.computed(function() {
		return accounting.formatMoney(self.price());
	});

	self.dividendLabel = function() {
		if ( self.symbol === 'BND' ) {
			return "Interest:";
		}
		return "Dividend:";
	};

	self.dividendFmt = function() {
		var d = "NO YIELD";
		if ( self.dividend > 0 ) {
			d = accounting.formatMoney(self.dividend);
		}
		return d;
	};

	self.deltaFmt = ko.computed(function() {
		if (self.delta() ) {
			var prefix = "";
			if ( parseInt(self.delta()) >= 0 ) {
				prefix = "+";
			}
			return prefix + self.delta();
		}
	});

	self.isUp = ko.computed(function() {
		if ( parseInt(self.delta()) >= 0 ) {
			return true;
		}
		return false;
	});

	self.isDown = ko.computed(function() {
		if ( parseInt(self.delta()) < 0 ) {
			return true;
		}
		return false;
	});
};