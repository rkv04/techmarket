<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Services\AuthService;
use App\Exceptions\AuthException;
use App\Exceptions\TokenException;
use App\Exceptions\ValidationException;
use Throwable;


class AuthController {
    public static function login(Request $request, Response $response) {
        $user = $request->getParsedBody();
        $email = $user['email'] ?? null;
        $password = $user['password'] ?? null;
        try {
            AuthService::login($email, $password);
            return self::jsonResponse($response, ['message' => 'Successfully authorized'], 200);
        }
        catch (AuthException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 409);
        }
        catch (ValidationException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 400);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'Internal server error'], 500);
        }
    }

    public static function logout(Request $request, Response $response) {
        AuthService::logout();
        return self::jsonResponse($response, ['message' => 'Logged out successfully'], 200);
    }
    
    public static function register(Request $request, Response $response) {
        $user = $request->getParsedBody();
        try {
            AuthService::register($user);
            return self::jsonResponse($response, ['message' => 'Successfully registered'], 201);
        }
        catch (AuthException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 409);
        }
        catch (ValidationException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 400);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'Internal server error'], 500);
        }
    }

    public static function handlePasswordForgotRequest(Request $request, Response $response) {
        $email = $request->getParsedBody()['email'] ?? null;
        try {
            AuthService::handlePasswordForgotRequest($email);
            return self::jsonResponse($response, ['message' => 'Reset link sent to email'], 200);
        }
        catch (ValidationException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 400);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'Internal server error'], 500);
        }
    }

    public static function handlePasswordResetRequest(Request $request, Response $response) {
        $data = $request->getParsedBody();
        $token = $data['token'] ?? null;
        $password = $data['password'] ?? null;
        $passwordRepeated = $data['passwordRepeated'] ?? null;
        try {
            AuthService::handlePasswordResetRequest($token, $password, $passwordRepeated);
            return self::jsonResponse($response, ['message' => 'Password successfully changed'], 200);
        }
        catch (ValidationException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 400);
        }
        catch (TokenException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 410);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'Internal server error'], 500);
        }
    }

    private static function jsonResponse(Response $response, $data, $status) {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json")->withStatus($status);
    }
}

