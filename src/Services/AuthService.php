<?php

namespace App\Services;

use App\Models\UserModel;
use App\Models\TokenModel;
use App\Utils\Utils;
use App\Exceptions\AuthException;
use App\Exceptions\TokenException;
use App\Exceptions\ValidationException;
use DateTime;

class AuthService {
    public static function login($email, $password) {
        if (empty($password) || empty($email)) {
            throw new ValidationException("VALIDATION_REQUIRED_FIELDS");
        }
        if (strlen($password) > 72) {
            throw new ValidationException("VALIDATION_PASSWORD_TOO_LONG");
        }
        if (!self::validateEmail($email)) {
            throw new ValidationException("VALIDATION_INVALID_EMAIL");
        }
        $user = UserModel::getUserByEmail($email);
        if ($user !== null && password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user;
            $_SESSION['lastActivity'] = time();
            return $user;
        }
        throw new AuthException("AUTH_INVALID_CREDENTIALS");
    }

    public static function logout() {
        session_unset();
        session_destroy();
    }
    
    public static function register($user) {
        if (empty($user['password']) || empty($user['email']) || empty($user['name'])) {
            throw new ValidationException("VALIDATION_REQUIRED_FIELDS");
        }
        if (UserModel::getUserByEmail($user['email'])) {
            throw new AuthException("EMAIL_ALREADY_EXISTS");
        }
        if (!self::validateEmail($user['email'])) {
            throw new ValidationException('VALIDATION_INVALID_EMAIL');
        }
        if (!self::validatePassword($user['password'])) {
            throw new ValidationException('VALIDATION_WEAK_PASSWORD');
        }
        $user['password'] = Utils::getBcryptHash($user['password']);
        UserModel::addUser($user);
    }

    public static function handlePasswordForgotRequest($email) {
        if (!self::validateEmail($email)) {
            throw new ValidationException('VALIDATION_INVALID_EMAIL');
        }
        if (!UserModel::getUserByEmail($email)) {
            return;
        }
        $token = bin2hex(random_bytes(32));
        $expires_at = (new DateTime('+10 min'))->format("Y-m-d H:i:s");
        TokenModel::addUserResetToken($email, $token, $expires_at);
        self::sendResetMail($email, $token);
    }

    private static function sendResetMail($email, $token) {
        $subject = "TechMarket password reset";
        $message = "Your reset token: $token";
        $headers = "From: no-reply@b93332pg.beget.tech" . "\r\n";
        mail($email, $subject, $message, $headers);
    }

    public static function handlePasswordResetRequest($receivedToken, $password, $passwordRepeated) {
        if (empty($password) || empty($passwordRepeated)) {
            throw new ValidationException("VALIDATION_REQUIRED_FIELDS");
        }
        $tokenEntry = self::verifyResetToken($receivedToken);
        if ($tokenEntry === null) {
            throw new TokenException('AUTH_TOKEN_INVALID');
        }
        if (!self::validatePassword($password)) {
            throw new ValidationException('VALIDATION_WEAK_PASSWORD');
        }
        if ($password !== $passwordRepeated) {
            throw new ValidationException('VALIDATION_PASSWORD_MISMATCH');
        }
        $passwordHash = Utils::getBcryptHash($password);
        UserModel::updatePasswordByEmail($tokenEntry['email'], $passwordHash);
    }

    public static function changeUserPassword($bodyData) {
        $password = $bodyData['password'] ?? null;
        $passwordRepeated = $bodyData['passwordRepeated'] ?? null;
        if (empty($password) || empty($passwordRepeated)) {
            throw new ValidationException("VALIDATION_REQUIRED_FIELDS");
        }
        if (!self::validatePassword($password)) {
            throw new ValidationException('VALIDATION_WEAK_PASSWORD');
        }
        if ($password !== $passwordRepeated) {
            throw new ValidationException('VALIDATION_PASSWORD_MISMATCH');
        }
        $userId = $_SESSION['user']['id'];
        $passwordHash = Utils::getBcryptHash($password);
        UserModel::updatePasswordById($userId, $passwordHash);
    }

    private static function verifyResetToken($receivedToken) {
        $tokenEntry = TokenModel::getTokenEntry($receivedToken);
        $currentTime = new DateTime();
        $tokenExpiryTime = new DateTime($tokenEntry['expires_at']);
        if (isset($tokenEntry) && $tokenEntry['token'] === $receivedToken && $tokenExpiryTime > $currentTime) {
            return $tokenEntry;
        }
        return null;
    }

    private static function validateEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        return true;
    }

    private static function validatePassword($password) {
        $len = strlen($password);
        if ($len < 8 || $len > 72) {
            return false;
        }
        if (preg_match('/[а-яА-ЯёЁ]/', $password)) {
            return false;
        }
        if (!preg_match('/[0-9]/', $password)){
            return false;
        }
        if (!preg_match('/[A-Z]/', $password)){
            return false;
        }
        if (!preg_match('/[a-z]/', $password)){
            return false;
        }
        return true;
    }
}

