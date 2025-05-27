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
        try {
            $productCategories = ProductService::getProductCategories();
            return self::jsonResponse($response, $productCategories, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function getProductSubcategoryByCategory(Request $request, Response $response, array $args) {
        $categoryId = $args['category_id'];
        try {
            $productSubcategories = ProductService::getProductSubcategoryByCategory($categoryId);
            return self::jsonResponse($response, $productSubcategories, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function getCategoryTree(Request $request, Response $response) {
        try {
            $categoryTree = ProductService::getCategoryTree();
            return self::jsonResponse($response, $categoryTree, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function getProductManufacturers(Request $request, Response $response) {
        try {
            $manufacturers = ProductService::getProductManufacturers();
            return self::jsonResponse($response, $manufacturers, 200);
        }
        catch (Throwable $e) {
            return self::jsonResponse($response, ['error' => 'SERVER_ERROR'], 500);
        }
    }

    public static function addProduct(Request $request, Response $response) {
        $productData = $request->getParsedBody();
        $uploadedFiles = $request->getUploadedFiles();
        ProductService::addProduct($productData, $uploadedFiles);
        return self::jsonResponse($response, ['message' => 'OK'], 200);
    }

    private static function jsonResponse(Response $response, $data, $status) {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json")->withStatus($status);
    }
}

