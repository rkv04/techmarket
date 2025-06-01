<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\MenuService;
use Throwable;


class MenuController {
    public static function getUserMenu(Request $request, Response $response) {
        try {
            $userMenu = MenuService::getUserMenu();
            return self::jsonResponse($response, $userMenu, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function updateUserMenu(Request $request, Response $response) {
        $userMenuItems = $request->getParsedBody();
        // try {
            $userMenu = MenuService::updateUserMenu($userMenuItems);
            return self::jsonResponse($response, $userMenu, 200);
        // }
        // catch (Throwable $e) {
        //     return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        // }
    }

    private static function jsonResponse(Response $response, $data, $status) {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json")->withStatus($status);
    }
}

