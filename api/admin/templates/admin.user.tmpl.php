<div>
<ul>
<?php foreach ($users as $user) {?>
	<li>
		<span><?php echo $user->username;  ?></span>
		<span>(<?php echo $user->email; ?>)</span>
	</li>
<?php }?>
</ul>
</div>