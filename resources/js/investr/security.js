function Security(security) {
	var self = this;

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

	self.adjustPrice = function(roll, market) {
		try {
			var i = parseInt(roll) - 1; // convert die roll into array index
			var currentPrice = self.price();
			var priceChange = self.bullChanges[1];
			if ( market === 'bear') {
				priceChange = self.bearChanges[i];
			}
			self.price(currentPrice + priceChange);
		} catch(err) {
			log.error("Not a valid die roll", err);
		}
	};

/*	self.getPriceForYear = function(year) {
		var yearPrice = ko.utils.arrayFilter(self.priceHistory(), function(yearPrice) {
			return yearPrice.year === year;
		});
		return yearPrice.price;
	};*/

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