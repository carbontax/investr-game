<H4>GAME #<?php echo $game->id; ?></H4>

<div>
	<span><form action="<?php echo $game->id; ?>/proc" method="POST"><input type="submit" value="Process Orders" /></form></span>
	<span><form action="<?php echo $game->id; ?>/del" method="POST"><input type='submit' value='Delete Game' /></form></span>
</div>
<H5>Players</H5>
	<ul><?php foreach ($game->players as $player) { ?>
		<li><?php echo $player->username; ?>
			<H6>Orders</H6>
			<ul><?php foreach ($player->orders as $order) { ?>
				<li><span><?php echo $order->action; ?></span></li>
			<?php } ?>
			</ul>
			<H6>Portfolio</H6>
			<ul><?php foreach ($player->portfolio as $holding) { ?>
				<li><span class="label">Security ID:</span>
					<span><?php echo $holding->security_id; ?></span>
					<span class="label">Shares:</span>
					<span><?php echo $holding->shares; ?></span></li>
			<?php } ?>
			</ul>
		</li>
		<?php } ?>
	</ul>