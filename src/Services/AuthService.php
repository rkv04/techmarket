<?php

namespace App\Services;

use App\Models\UserModel;


class AuthService {
    public static function login($email, $password) {
        $user = UserModel::getUserByEmail($email);
        if ($user != null && $user["password"] === $password) {
            $_SESSION['user'] = $user;
            $_SESSION['lastActivity'] = time();
            return $user;
        }
        return null;
    }

    public static function logout() {
        session_unset();
        session_destroy();
    }
    
    public static function register($user) {
        if (UserModel::getUserByEmail($user["email"]) != null) {
            return null;
        }
        $userId = UserModel::addUser($user);
        return ["id" => $userId];
    }
}

