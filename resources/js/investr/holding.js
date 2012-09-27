function Holding(holding, game) {
	var self = this;

	if ( typeof(holding) === 'string' ) {
		holding = {'security_symbol': holding, 'shares': 0};
	}
	self.symbol = holding.security_symbol;
	self.shares = holding.shares;

	// look up the security by symbol
	self.security = ko.utils.arrayFilter(game.securities(), function(s) {
			return s.symbol === self.symbol;
		})[0];

	self.income = function() {
		if ( ! self.security /*self.security === null */) {
			return 0;
		}
		return self.security.dividend * self.shares;
	};

	self.incomeFmt = function() {
		return accounting.formatMoney(self.income());
	};
	
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