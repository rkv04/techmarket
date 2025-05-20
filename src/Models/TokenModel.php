<?php

namespace App\Models;

use App\Db\Database;

class TokenModel {
    public static function addUserResetToken($email, $token, $expires_at) {
        $old_token = self::getUserResetTokenByEmail($email);
        if ($old_token !== null) {
            self::deleteUserResetToken($email);
        }
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("INSERT INTO Password_reset_token (email, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$email, $token, $expires_at]);
    }

    public static function getTokenEntry($token) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT email, token, expires_at FROM Password_reset_token WHERE token = ?");
        $stmt->execute([$token]);
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return null;
    }

    private static function getUserResetTokenByEmail($email) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM Password_reset_token WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return null;
    }

    private static function deleteUserResetToken($email) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM Password_reset_token WHERE email = ?");
        $stmt->execute([$email]);
    }

}