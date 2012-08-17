var securities = [
	{'name': "Growth Corporation of America", 'price': 100, 'outstanding': 600, 'bearChanges': [12,7,9,7,8,6,5,-2,11,-5,-8], 'bullChanges': [-2,26,18,23,20,17,19,11,13,14,24]},
	{'name': "Metro Properties, Inc.", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Pioneer Mutual Fund", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Shady Brooks Development", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Stryker Drilling Company", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Tri-City Transport Company", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "United Auto Company", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Uranium Enterprises, Inc.", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Vally Power & Light Company", 'price': 100, 'outstanding': 600, 'bearChanges': [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12], 'bullChanges': [1,2,3,4,5,6,7,8,9,10,11,12]},
	{'name': "Central City Municipal Bonds", 'price': 1, 'outstanding': 60000, 'bearChanges': [0,0,0,0,0,0,0,0,0,0,0,0], 'bullChanges': [0,0,0,0,0,0,0,0,0,0,0,0]}
];

var players = [
	{'username': 'googalan', 'portfolio': [], 'balance': 5000, 'margin': 0},
	{'username': 'carbontax', 'portfolio': [], 'balance': 5000, 'margin': 0},
	{'username': 'peppercorn', 'portfolio': [], 'balance': 5000, 'margin': 0},
	{'username': 'nsmithlea', 'portfolio': [], 'balance': 5000, 'margin': 0},
];

var game1 = {
	'securities' : securities,
	'players': players,
	'year': 3,
	'lastYear': 12
};

var new_game = {
	'securities' : securities,
	'players': players,
	'year': 1,
	'lastYear': 10
};

var sample_users = [
	{'username': 'googalan', 'logged_in': true, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}, 
	{'username': "carbontax", 'logged_in': false, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}, 
	{'username': "nsmithlea", 'logged_in': false, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}, 
	{'username': "peppercorn", 'logged_in': false, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}
];

// devel mode (http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript)
function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function InvestrViewModel() {
	// devel mode
	var gameId = getParameterByName("gameId");

	self.title = "Stock & Bonds";

	self.users = ko.observableArray($.map(sample_users, function(u) {
		return new User(u);
	}));

	self.user = ko.utils.arrayFilter(self.users(), function(u){
		return u.isLoggedIn();
	});

	self.game = ko.observable(null);

	self.newGame = function() {
		// query server for initial setup
		self.game(new Game(new_game));
	};

	try {
		if ( gameId ) {
			if ( isNaN(gameId) ) {
				throw new Error("Invalid gameId");
			} else {
				self.game(new Game(game1));
			}
		} else {
			self.newGame();
		}
	} catch(err) {
		$('#messages').disco_messages('errors', err.message);
		log.info(err.message, err);
	}
}