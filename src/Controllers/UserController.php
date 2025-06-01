<?php

namespace App\Controllers;

use App\Exceptions\AuthException;
use App\Exceptions\ValidationException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Services\UserService;
use Throwable;


class UserController {
    public static function getUserProfile(Request $request, Response $response) {
        try {
            $user = UserService::getUser();
            return self::jsonResponse($response, $user, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function updateUser(Request $request, Response $response) {
        $user = $request->getParsedBody();
        try {
            UserService::updateUser($user);
            return self::jsonResponse($response, ['message' => 'UPDATE_SUCCESS'], 200);
        }
        catch (ValidationException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 400);
        }
        catch (AuthException $e) {
            return self::jsonResponse($response, ['error' => $e->getMessage()], 409);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    private static function jsonResponse(Response $response, $data, $status) {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json")->withStatus($status);
    }
}

