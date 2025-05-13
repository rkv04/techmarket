<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Services\AuthService;

class AuthController {
    public static function login(Request $request, Response $response) {
        $user = $request->getParsedBody();
        $user = AuthService::login($user["email"], $user["password"]);
        if ($user === null) {
            $response->getBody()->write(json_encode(["error" => "Incorrect email address or password"]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(409);
        }
        return $response->withHeader("Content-Type", "application/json")->withStatus(200);
    }

    public static function logout(Request $request, Response $response) {
        AuthService::logout();
        $response->getBody()->write(json_encode(['message' => 'Logged out successfully']));
        return $response->withHeader("Content-Type", "application/json")->withStatus(200);
    }
    
    public static function register(Request $request, Response $response) {
        $user = $request->getParsedBody();
        $userId = AuthService::register($user);
        if ($userId === null) {
            $response->getBody()->write(json_encode(["error" => "A user with this email already exists"]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(409);
        }
        $response->getBody()->write(json_encode($userId));
        return $response->withHeader("Content-Type", "application/json")->withStatus(201);
    }
}

