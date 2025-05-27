<?php

namespace App\Middleware;


class Middleware {
    public static function verifySession($request, $handler) {
        if (isset($_SESSION['lastActivity']) && (time() - $_SESSION["lastActivity"]) < 5 * 60) {
            $_SESSION['lastActivity'] = time();
            return $handler->handle($request);
        }
        session_unset();
        session_destroy();
        $response = new \Slim\Psr7\Response();
        $response->getBody()->write(json_encode(["error" => 'Not authorized']));
        return $response->withStatus(403)->withHeader("Content-Type", "application/json");
    }

    public static function initSession($request, $handler) {
        ini_set('session.gc_maxlifetime', 15); // todo
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => false,
            'httponly' => true,
        ]);
        session_start();
        return $handler->handle($request);
    }

    public static function checkAdminPermission($request, $handler) {
        if ($_SESSION['user']['role'] === 'admin') {
            return $handler->handle($request);
        }
        $response = new \Slim\Psr7\Response();
        $response->getBody()->write(json_encode(["error" => 'Permission denied']));
        return $response->withStatus(403)->withHeader("Content-Type", "application/json");
    }
}

