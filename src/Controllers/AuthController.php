<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Services\AuthService;
use App\Exceptions\AuthException;
use App\Exceptions\ValidationException;
use App\Models\UserModel;

class AuthController {
    public static function login(Request $request, Response $response) {
        $user = $request->getParsedBody();
        try {
            AuthService::login($user['email'], $user['password']);
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        }
        catch (AuthException $e) {
            $response->getBody()->write(json_encode(["error" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(409);
        }
    }

    public static function logout(Request $request, Response $response) {
        AuthService::logout();
        $response->getBody()->write(json_encode(['message' => 'Logged out successfully']));
        return $response->withHeader("Content-Type", "application/json")->withStatus(200);
    }
    
    public static function register(Request $request, Response $response) {
        $user = $request->getParsedBody();
        try {
            AuthService::register($user);
            $response->getBody()->write(json_encode(['message' => 'Successfully registered']));
            return $response->withHeader("Content-Type", "application/json")->withStatus(201);
        }
        catch (AuthException $e) {
            $response->getBody()->write(json_encode(["error" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(409);
        }
    }

    public static function handlePasswordForgotRequest(Request $request, Response $response) {
        $email = $request->getParsedBody()['email'];
        try {
            AuthService::handlePasswordForgotRequest($email);
            $response->getBody()->write(json_encode(['message' => 'Reset link sent to email']));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        }
        catch (AuthException $e) {
            $response->getBody()->write(json_encode(["error" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(409);
        }
    }

    public static function handlePasswordResetRequest(Request $request, Response $response) {
        $data = $request->getParsedBody();
        $token = $data['token'];
        $password = $data['password'];
        $passwordRepeated = $data['passwordRepeated'];
        try {
            AuthService::handlePasswordResetRequest($token, $password, $passwordRepeated);
            $response->getBody()->write(json_encode(['message' => 'Password successfully changed']));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        }
        catch (ValidationException $e) {
            $response->getBody()->write(json_encode(["error" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(410);
        }
    }
}

