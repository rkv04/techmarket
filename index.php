<?php

require_once __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;

use App\Controllers\UserController;
use App\Controllers\AuthController;
use App\Middleware\Middleware;

$app = AppFactory::create();

$app->add([Middleware::class, 'initSession']);

$app->addErrorMiddleware(true, false, false);
$app->addBodyParsingMiddleware();

$app->post("/login", [AuthController::class, 'login']);
$app->post("/register", [AuthController::class, 'register']);
$app->post("/logout", [AuthController::class, 'logout']);

$app->get("/users", [UserController::class, 'getUsers'])->add([Middleware::class, 'verifySession']);

$app->run();

