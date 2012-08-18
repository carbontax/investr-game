/*var securities = [
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
*/
var securities = [
	{'name': "Growth Corporation of America", 'price': 100, 'outstanding': 600, 'bearChanges': [12,7,9,7,8,6,5,-2,11,-5,-8], 'bullChanges': [-2,26,18,23,20,17,19,11,13,14,24]},
	{'name': "Metro Properties, Inc.", 'price': 100, 'outstanding': 600, 'bearChanges': [14,-6,10,8,6,4,7,6,11,13,-10], 'bullChanges': [-10,16,23,28,15,21,24,18,31,-8,24]},
	{'name': "Pioneer Mutual Fund", 'price': 100, 'outstanding': 600, 'bearChanges': [13,10,7,5,4,3,-1,-3,-5,-8,-10], 'bullChanges': [-7,25,11,-2,15,13,17,14,1,19,23]},
	{'name': "Shady Brooks Development", 'price': 100, 'outstanding': 600, 'bearChanges': [10,-10,-5,-6,-4,3,-3,-8,-7,6,-15], 'bullChanges': [-9,8,12,11,7,-2,9,22,24,-1,20]},
	{'name': "Stryker Drilling Company", 'price': 100, 'outstanding': 600, 'bearChanges': [10,30,-20,-40,-15,45,-20,30,25,-20], 'bullChanges': [-2,-14,46,56,-20,37,-5,67,-11,-9,51]},
	{'name': "Tri-City Transport Company", 'price': 100, 'outstanding': 600, 'bearChanges': [20,6,12,3,8,5,6,7,10,4,-20], 'bullChanges': [-9,21,18,19,15,23,26,15,18,25,27]},
	{'name': "United Auto Company", 'price': 100, 'outstanding': 600, 'bearChanges': [21,-19,21,16,4,8,-10,10,-11,18,-23], 'bullChanges': [-7,14,-5,30,13,23,13,22,18,-10,38]},
	{'name': "Uranium Enterprises, Inc.", 'price': 100, 'outstanding': 600, 'bearChanges': [25,22,18,-14,-12,-8,10,14,-18,-22,-25], 'bullChanges': [-16,-4,34,29,-10,19,-7,18,-14,13,33]},
	{'name': "Vally Power & Light Company", 'price': 100, 'outstanding': 600, 'bearChanges': [8,-2,7,4,3,5,4,6,-4,-4,-7], 'bullChanges': [-4,17,15,14,12,14,15,13,10,19,18]},
	{'name': "Central City Municipal Bonds", 'price': 1, 'outstanding': 60000, 'bearChanges': [0,0,0,0,0,0,0,0,0,0,0,0], 'bullChanges': [0,0,0,0,0,0,0,0,0,0,0,0]}
];

var startingTransactions = [{'balance': 5000}]

var player = {'username': 'googalan', 'portfolio': [], 'transactions': startingTransactions};

var otherPlayers = [
	{'username': 'carbontax', 'portfolio': [], 'transactions': startingTransactions},
	{'username': 'peppercorn', 'portfolio': [], 'transactions': startingTransactions},
	{'username': 'nsmithlea', 'portfolio': [], 'transactions': startingTransactions}
];

var game1 = {
	'player': player,
	'otherPlayers': otherPlayers,
	'securities' : securities,
	'year': 3,
	'lastYear': 12
};

var new_game = {
	'player': player,
	'otherPlayers': otherPlayers,
	'securities' : securities,
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
	var dummy;
}