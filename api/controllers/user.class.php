<?php
class UserController {
    public static function getLoggedInUser() {
        $user = null;
        $username = getSession()->get(Constants::USERNAME);
        if ( $username != null ) {
            $u = getDatabase()->one('SELECT * FROM users WHERE username=:username', array('username' => $username));
            $user = new User($u);
        }
        return $user;
    }

    public static function findUserByEmail($email = null) {
        $user = getDatabase()->one('SELECT * FROM users WHERE email=:email', array('email' => $email));
    }

    public static function apiUsers() {
        $user_id = LoginController::getUserId();
        $query = 'select id, username from ' . User::TABLENAME . ' where id <> :user_id';
        $rows = getDatabase()->all($query, array('user_id' => $user_id));
        return $rows;
    }

/*    public static function findUserByUsername($username = null) {
        $user = getDatabase()->one('SELECT * FROM users WHERE username=:username', array('username' => $username));
        $user = null;
        foreach ( UserController::getDummyUsers() as $u ) {
            if ( $u->username === $username ) {
                $user = $u;
                break;
            }
        }
        return $user;
    }
*/
/*    static public function getDummyUsers() {
        return array(
            new User(array('username' => 'carbontax', 'email' => 'carbontax@gmail.com', 'password' => 'foo')),
            new User(array('username' => 'googalan', 'email' => 'googalan@gmail.com', 'password' => 'foo')),
            new User(array('username' => 'nsmithlea', 'email' => 'nsmithlea@gmail.com', 'password' => 'foo'))
            );
    } */
}