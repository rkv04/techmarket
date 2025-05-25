<?php

require_once __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;

use App\Controllers\UserController;
use App\Controllers\AuthController;
use App\Controllers\ProductController;
use App\Middleware\Middleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app = AppFactory::create();

$app->add([Middleware::class, 'initSession']);
$app->addErrorMiddleware(true, false, false);
$app->addBodyParsingMiddleware();

$app->group("/api", function (RouteCollectorProxy $group) {

    $group->group('/auth', function (RouteCollectorProxy $group) {
        $group->post("/register", [AuthController::class, 'register']);
        $group->post("/login", [AuthController::class, 'login']);
        $group->post("/logout", [AuthController::class, 'logout']);
        $group->post("/password-forgot", [AuthController::class, 'handlePasswordForgotRequest']);
        $group->post("/password-reset", [AuthController::class, 'handlePasswordResetRequest']);
    });

    $group->get('/products', [ProductController::class, 'getProducts'])->add([Middleware::class, 'verifySession']);

    $group->any('/{routes:.+}', function (Request $request, Response $response) {
        $response->getBody()->write(json_encode(['error' => 'Not Found']));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    });

});

$app->run();

