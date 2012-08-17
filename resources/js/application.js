var version = "2.1.1";
var oops = function() {
	try {
		console.log("Ooops");
		throw new Error("Yaaaaarrr!!!");
	} catch(err) {
		if ( err.name.toString() === "TypeError" ) {
			log.error("What are ya? IE7?", err);
		} else {
			log.error("not a type error", err);
		}
	}
};

$(document).ready(function() {
//	log.info("VERSION: " + version);

	$('#intro').prepend("VERSION " + version + ": ");
	$('#dialog-box').dialog({
		autoOpen: false,
		modal: true
	});

	try {
		$('#form-container').on('click', '#submit-button', function() {
			$('#intro').append(" GO!");
			oops();
			$('#dialog-box').dialog('option', 'title', 'GREETINGS v.' + version)
			.html("Hello World")
			.dialog('open');
		});
	} catch(err) {
		if ( err.name.toString() === "TypeError" ) {
			log.error("type error caught", err);
		} else {
			log.error("not a type error", err);
		}
	}
});
