<?php

namespace App\Utils;


class Utils {
    public static function getBcryptHash($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }
}