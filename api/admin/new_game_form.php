<fieldset id="new_game_form_fieldset">
<legend>Create a new game</legend>
<form id="new_game_form" method="post" action="games">
	<div>
		<label for="initial_balance">Initial Balance</label>
		<input name="initial_balance" value="5000"/>
	</div>	
	<div>
		<label for="number_of_players">Number of Players</label>
		<input name="number_of_players" value="4"/>
	</div>	
	<div>
		<label for="last_year">Final Year</label>
		<input name="last_year" value="10"/>
	</div>
	<div>
		<input name="submit" type="submit" id="new_game_form_submit"/>
	</div>	
	<div>
		<input name="reset" type="reset" id="new_game_form_reset"/>
	</div>	
</form>
</fieldset>