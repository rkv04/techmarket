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

    public static function getUserById($userId) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT name, email, birth_date AS birthDate FROM User WHERE id = ?");
        $stmt->execute([$userId]);
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

    public static function updatePasswordByEmail($email, $passwordHash) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("UPDATE User SET password = ? WHERE email = ?");
        $stmt->execute([$passwordHash, $email]);
    }

    public static function updatePasswordById($userId, $passwordHash) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("UPDATE User SET password = ? WHERE id = ?");
        $stmt->execute([$passwordHash, $userId]);
    }

    public static function updateUser($user) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("UPDATE User SET name = ?, email = ?, birth_date = ? WHERE id = ?");
        $stmt->execute([$user['name'], $user['email'], $user['birthDate'], $user['id']]);
    }
}

