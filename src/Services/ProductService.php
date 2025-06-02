<?php

namespace App\Services;

use App\Exceptions\ValidationException;
use App\Models\ProductModel;
use App\Utils\Utils;

class ProductService {

    private const BASE_DIR = "/home/b/b93332pg/techmarket/public_html/"; // path

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
        return array_merge([
            'page' => 1,
            'category' => null,
            'subcategory' => null,
            'manufacturer' => null,
            'price_min' => null,
            'price_max' => null,
            'available' => null,
            'discount' => null,
            'new' => null,
            'sort' => 'product_id',
            'order' => 'ASC',
            'search' => null
        ], $queryParamsRaw);
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
        self::validateProductData($productData, $uploadedFiles);
        $image = $uploadedFiles["image"];
        $originalImageInfo = Utils::moveImage($image, self::BASE_DIR . "uploads/"); // path
        $thumbnailImageInfo = Utils::compressAndSaveImage($originalImageInfo['path'], self::BASE_DIR . "uploads/", 200, 200, 90); // path
        Utils::addWatermark($originalImageInfo['path'], self::BASE_DIR . 'watermarks/watermark.png'); // path
        $productData['imageFilename'] = $originalImageInfo['filename'];
        $productData['thumbnailFilename'] = $thumbnailImageInfo['filename'];
        ProductModel::addProduct($productData);
    }

    private static function validateProductData(array &$productData, $uploadedFiles) {
        if (!isset($uploadedFiles['image']) || $uploadedFiles['image']->getError() !== UPLOAD_ERR_OK) {
            throw new ValidationException("VALIDATION_IMAGE_REQUIRED");
        }
        $productData = array_merge([
            'name' => null,
            'shortDescription' => null,
            'fullDescription' => null,
            'subcategoryId' => null,
            'price' => null,
            'oldPrice' => null,
            'isDiscount' => 0,
            'quantity' => null,
            'manufacturerId' => null
        ], $productData);

        $requiredFields = ['name', 'shortDescription', 'fullDescription', 'subcategoryId', 'price', 'quantity', 'manufacturerId'];
        foreach ($requiredFields as $field) {
            if (empty($productData[$field])) {
                throw new ValidationException("VALIDATION_REQUIRED_FIELDS");
            }
        }
        if (!ProductModel::getManufacturerById($productData['manufacturerId']) || !ProductModel::getSubcategoryById($productData['subcategoryId'])) {
            throw new ValidationException("INVALID_ID");
        }
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

    public static function importProductsFromXML($uploadedFiles) {
        if (!isset($uploadedFiles['xml']) || $uploadedFiles['xml']->getError() !== UPLOAD_ERR_OK) {
            throw new ValidationException("VALIDATION_XML_REQUIRED");
        }
        $xmlFile = $uploadedFiles['xml'];
        $xmlString = $xmlFile->getStream()->getContents();
        $productsDataXML = simplexml_load_string($xmlString);
        foreach ($productsDataXML->product as $xmlProduct) {
            $productData = [
                'name' => (string)$xmlProduct->name,
                'shortDescription' => (string)$xmlProduct->short_description,
                'fullDescription' => (string)$xmlProduct->full_description,
                'subcategoryId' => (int)$xmlProduct->subcategory_id,
                'price' => (float)$xmlProduct->price,
                'oldPrice' => isset($xmlProduct->old_price) ? (float)$xmlProduct->old_price : null,
                'isDiscount' => isset($xmlProduct->is_discount) ? (int)$xmlProduct->is_discount : 0,
                'quantity' => (int)$xmlProduct->quantity,
                'manufacturerId' => (int)$xmlProduct->manufacturer_id
            ];
            ProductModel::addProduct($productData);
        }
    }
}

