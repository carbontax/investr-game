CREATE TABLE  `investr`.`users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    `username` VARCHAR( 128 ) NOT NULL ,
    `password` VARCHAR( 256 ) NOT NULL ,
    `salt` VARCHAR( 256 ) NOT NULL ,
    `email` VARCHAR( 256 ) NOT NULL ,
    UNIQUE (
        `username` ,
        `email`
    )
) ENGINE = MYISAM ;