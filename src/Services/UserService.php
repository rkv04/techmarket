<?php

namespace App\Services;

use App\Exceptions\AuthException;
use App\Exceptions\ValidationException;
use App\Models\UserModel;


class UserService {
    public static function getUser() {
        $userId = $_SESSION['user']['id'];
        $user = UserModel::getUserById($userId);
        return $user;
    }

    public static function updateUser($user) {
        $user['id'] = $_SESSION['user']['id'];
        $user['email'] = $user['email'] ?? null;
        $user['name'] = $user['name'] ?? null;
        $user['birthDate'] = $user['birthDate'] ?? null;
        if (empty($user['email']) || empty($user['name'])) {
            throw new ValidationException('VALIDATION_REQUIRED_FIELDS');
        }
        if (!self::validateEmail($user['email'])) {
            throw new ValidationException('VALIDATION_INVALID_EMAIL');
        }
        $userFromDb = UserModel::getUserByEmail($user['email']);
        if ($userFromDb !== null && $userFromDb['id'] !== $user['id']) {
            throw new AuthException("EMAIL_ALREADY_EXISTS");
        }
        UserModel::updateUser($user);
    }

    private static function validateEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        return true;
    }
}

