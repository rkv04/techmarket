<?php

namespace App\Controllers;

use App\Services\ProductService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

class ProductController {
    static public function getProducts(Request $request, Response $response) {
        $queryParams = $request->getQueryParams();
        try {
            $products = ProductService::getProducts($queryParams);
            return self::jsonResponse($response, $products, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function getProductCategories(Request $request, Response $response) {
        
    }

    private static function jsonResponse(Response $response, $data, $status) {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json")->withStatus($status);
    }
}

