<?php

namespace App\Services;

use App\Models\UserModel;
use App\Models\TokenModel;
use App\Utils\Utils;
use App\Exceptions\AuthException;
use App\Exceptions\ValidationException;
use DateTime;

class AuthService {
    public static function login($email, $password) {
        $user = UserModel::getUserByEmail($email);
        if ($user !== null && password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user;
            $_SESSION['lastActivity'] = time();
            return $user;
        }
        throw new AuthException("Incorrect email address or password");
    }

    public static function logout() {
        session_unset();
        session_destroy();
    }
    
    public static function register($user) {
        if (UserModel::getUserByEmail($user["email"]) !== null) {
            throw new AuthException("A user with this email already exists");
        }
        $user['password'] = Utils::getBcryptHash($user['password']);
        UserModel::addUser($user);
    }

    public static function handlePasswordForgotRequest($email) {
        $token = bin2hex(random_bytes(32));
        $expires_at = (new DateTime('+5 min'))->format("Y-m-d H:i:s");
        TokenModel::addUserResetToken($email, $token, $expires_at);
        AuthService::sendResetMail($email, $token);
    }

    private static function sendResetMail($email, $token) {
        $resetLink = "http://b93332pg.beget.tech/password-reset?token=$token";
        $subject = "TechMarket password reset";
        $message = "To reset your password, follow the link: $resetLink";
        $headers = "From: no-reply@b93332pg.beget.tech" . "\r\n";
        mail($email, $subject, $message, $headers);
    }

    public static function handlePasswordResetRequest($receivedToken, $password, $passwordRepeated) {
        $tokenEntry = AuthService::verifyResetToken($receivedToken);
        if ($tokenEntry === null) {
            throw new ValidationException('Token expired or invalid');
        }
        $passwordHash = Utils::getBcryptHash($password);
        UserModel::updatePasswordByEmail($tokenEntry['email'], $passwordHash);
    }

    private static function verifyResetToken($receivedToken) {
        $tokenEntry = TokenModel::getTokenEntry($receivedToken);
        $currentTime = new DateTime();
        $tokenExpiryTime = new DateTime($tokenEntry['expires_at']);
        if ($tokenEntry['token'] === $receivedToken && $tokenExpiryTime > $currentTime) {
            return $tokenEntry;
        }
        return null;
    }
}

