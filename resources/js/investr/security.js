function Security(security) {
	var self = this;

	self.name = security.name;
	self.price = ko.observable(security.price);
	self.outstanding = ko.observable(security.outstanding);
	self.bearChanges = security.bearChanges;
	self.bullChanges = security.bullChanges;

	self.priceFmt = ko.computed(function() {
		return accounting.formatMoney(self.price());
	});

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
};