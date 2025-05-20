<?php

namespace App\Models;

use App\Db\Database;

class UserModel {
    public static function getAllUsers() {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM User");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getUserByEmail($email) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM User WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() === 0) {
            return null;
        }
        return $stmt->fetch();
    }
    
    public static function addUser($user) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("INSERT INTO User (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$user["name"], $user["email"], $user["password"]]);
    }

    public static function updatePasswordByEmail($email, $password) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("UPDATE User SET password = ? WHERE email = ?");
        $stmt->execute([$password, $email]);
    }
}

