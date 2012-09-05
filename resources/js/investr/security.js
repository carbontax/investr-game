function Security(security) {
	var self = this;

	self.symbol = security.symbol;
	self.name = security.name;
	self.dividend = security.dividend;
	self.price = ko.observable(security.price);
	self.priceHistory = ko.observableArray(security.priceHistory)
	self.outstanding = ko.observable(security.outstanding);

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

	self.getPriceForYear = function(year) {
		var yearPrice = ko.utils.arrayFilter(self.priceHistory(), function(yearPrice) {
			return yearPrice.year === year;
		});
		return yearPrice.price;
	};
};