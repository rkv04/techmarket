<?php

namespace App\Controllers;

use App\Models\UserModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Services\UserService;

class UserController {
    public static function getUsers(Request $request, Response $response) {
        $users = UserModel::getAllUsers();
        $response->getBody()->write(json_encode($users));
        return $response->withHeader("Content-Type", "application/json")->withStatus(200);
    }
}

