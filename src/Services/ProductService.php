<?php

namespace App\Services;

use App\Models\ProductModel;
use App\Utils\Utils;

class ProductService {
    public static function getProducts($queryParams) {
        $preparedQueryParams = self::prepareQueryParams($queryParams);
        $products = ProductModel::getProducts($preparedQueryParams);
        return $products;
    }

    private static function prepareQueryParams($queryParams) {
        $queryParams = self::processUnsetValues($queryParams);
        self::validatePagination($queryParams);
        self::validateSorting($queryParams);
        self::validateOtherParameters($queryParams);
        return $queryParams;
    }

    private static function processUnsetValues(array &$queryParamsRaw) {
        return [
            'page' => $queryParamsRaw['page'] ?? 1,
            'category' => $queryParamsRaw['category'] ?? null,
            'subcategory' => $queryParamsRaw['subcategory'] ?? null,
            'manufacturer' => $queryParamsRaw['manufacturer'] ?? null,
            'price_min' => $queryParamsRaw['price_min'] ?? null,
            'price_max' => $queryParamsRaw['price_max'] ?? null,
            'available' => $queryParamsRaw['available'] ?? null,
            'discount' => $queryParamsRaw['discount'] ?? null,
            'new' => $queryParamsRaw['new'] ?? null,
            'sort' => $queryParamsRaw['sort'] ?? 'product_id',
            'order' => $queryParamsRaw['order'] ?? 'ASC',
            'search' => $queryParamsRaw['search'] ?? null
        ];
    }

    private static function validatePagination(array &$queryParams) {
        $queryParams['page'] = max(1, (int)$queryParams['page']);
    }

    private static function validateSorting(array &$queryParams) {
        $sortMap = [
            "price" => "price",
            "newness" => "created_at"
        ];
        $validSortTargets = ['price', 'newness'];
        $sortTarget = $queryParams['sort'];
        $queryParams['sort'] = in_array($sortTarget, $validSortTargets) ? $sortMap[$sortTarget] : 'product_id';
        $queryParams['order'] = strtoupper($queryParams['order']) === 'DESC' ? 'DESC' : 'ASC';
    }

    private static function validateOtherParameters(array &$queryParams) {
        if (isset($queryParams['available'])) {
            $queryParams['available'] = $queryParams['available'] === 'true' ? 'true' : null;
        }
        if (isset($queryParams['discount'])) {
            $queryParams['discount'] = $queryParams['discount'] === 'true' ? 'true' : null;
        }
        if (isset($queryParams['new'])) {
            $queryParams['new'] = $queryParams['new'] === 'true' ? 'true' : null;
        }
    }

    public static function addProduct($productData, $uploadedFiles) {
        $image = $uploadedFiles["image"];
        $imagePath = Utils::moveImage($image, "/home/b/b93332pg/techmarket/public_html/uploads/products/original/");
        $compressedPath = Utils::compressAndSaveImage($imagePath, "/home/b/b93332pg/techmarket/public_html/uploads/products/thumbnails", 350, 350, 90);
        Utils::addWatermark($imagePath, '/home/b/b93332pg/techmarket/public_html/watermark/watermark.png');
    }

    private static function validateProductData($productData, $uploadedFiles) {

    }

    public static function getProductCategories() {
        $productCategories = ProductModel::getProductCategories();
        return $productCategories;
    }

    public static function getProductManufacturers() {
        $manufacturers = ProductModel::getProductManufacturers();
        return $manufacturers;
    }

    public static function getProductSubcategoryByCategory($categoryId) {
        $productSubcategories = ProductModel::getProductSubcategoryByCategoryId($categoryId);
        return $productSubcategories;
    }

    public static function getCategoryTree() {
        $categoryTree = ProductModel::getCategoryTree();
        return $categoryTree;
    }
}

