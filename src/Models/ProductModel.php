<?php

namespace App\Models;

use App\Db\Database;

class ProductModel {

    private const LIMIT = 5;

    public static function getProducts($queryParams) {
        $query = self::buildQuery($queryParams);
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare($query['sql']);
        $stmt->execute($query['params']);
        $productsRaw = $stmt->fetchAll();
        $response = self::prepareProductListResponse($productsRaw);
        return $response;
    }

    private static function getProductImagesById($product_id) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT image_path, thumbnail_path FROM Product_image WHERE product_id = ?");
        $stmt->execute([$product_id]);
        return $stmt->fetchAll();
    }

    private static function buildQuery($queryParams) {
        $sql = self::getBaseQuery();
        $params = [];
        if ($queryParams['category']) {
            $sql .= ' AND pc.id = :category';
            $params[':category'] = $queryParams['category'];
        }
        if ($queryParams['subcategory']) {
            $sql .= ' AND ps.id = :subcategory';
            $params[':subcategory'] = $queryParams['subcategory'];
        }
        if ($queryParams['manufacturer']) {
            $sql .= ' AND m.id = :manufacturer';
            $params[':manufacturer'] = $queryParams['manufacturer'];
        }
        if ($queryParams['price_min']) {
            $sql .= ' AND price >= :price_min';
            $params[':price_min'] = $queryParams['price_min'];
        }
        if ($queryParams['price_max']) {
            $sql .= ' AND price <= :price_max';
            $params[':price_max'] = $queryParams['price_max'];
        }
        if ($queryParams['available']) {
            $sql .= ' AND quantity > 0';
        }
        if ($queryParams['discount']) {
            $sql .= ' AND is_discount = 1';
        }
        if ($queryParams['new']) {
            $sql .= ' AND created_at >= NOW() - INTERVAL 30 DAY';
        }
        if ($queryParams['search']) {
            $sql .= ' AND (p.name LIKE :search OR p.short_description LIKE :search OR p.full_description LIKE :search)';
            $params[':search'] = '%' . $queryParams['search'] . '%';
        }
        $sql .= " ORDER BY {$queryParams['sort']} {$queryParams['order']}";
        $limit = self::LIMIT;
        $offset = ($queryParams['page'] - 1) * $limit;
        $sql .= " LIMIT {$limit} OFFSET $offset";
        return ['sql' => $sql, 'params' => $params];
    }

    private static function getBaseQuery() {
        return "SELECT
                    COUNT(*) OVER() AS total_items, 
                    p.id AS product_id, 
                    p.name AS product_name, 
                    p.short_description, 
                    p.full_description, 
                    p.price, 
                    p.old_price, 
                    p.is_discount, 
                    p.quantity, 
                    m.id AS manufacturer_id, 
                    m.name AS manufacturer_name, 
                    pc.id AS product_category_id, 
                    pc.name AS product_category_name, 
                    ps.id AS product_subcategory_id, 
                    ps.name AS product_subcategory_name, 
                    c.id AS country_id, 
                    c.name AS country_name, 
                    c.alpha2 
                FROM Product p 
                    LEFT JOIN Manufacturer m ON p.manufacturer_id = m.id 
                    LEFT JOIN Country c ON m.country_id = c.id 
                    LEFT JOIN Product_subcategory ps ON p.subcategory_id = ps.id 
                    LEFT JOIN Product_category pc ON ps.category_id = pc.id 
                WHERE 1 = 1 ";
    }

    private static function prepareProductListResponse($productsRaw) {
        $products = [];
        foreach ($productsRaw as $product) {
            $productImages = self::getProductImagesById($product['product_id']);
            $products[] = [
                "id" => $product['product_id'],
                "name" => $product['product_name'],
                "shortDescription" => $product["short_description"],
                "fullDescription" => $product["full_description"],
                "category" => [
                    "id" => $product["product_category_id"],
                    "name" => $product["product_category_name"]
                ],
                "subcategory" => [
                    "id" => $product["product_subcategory_id"],
                    "name" => $product["product_subcategory_name"]
                ],
                "price" => $product["price"],
                "oldPrice" => $product["old_price"],
                "isDiscount" => $product["is_discount"],
                "quantity" => $product["quantity"],
                "manufacturer" => [
                    "id" => $product["manufacturer_id"],
                    "name" => $product["manufacturer_name"],
                ],
                "country" => [
                    "id" => $product["country_id"],
                    "name" => $product["country_name"],
                    "alpha2" => $product["alpha2"]
                ],
                "images" => $productImages
            ];
        }
        $totalPages = count($productsRaw) > 0 ? ceil($productsRaw[0]['total_items'] / self::LIMIT) : 0;
        $response = [
            "info" => [
                "total_items" => count($productsRaw),
                "total_pages" => $totalPages
            ],
            "products" => $products
        ];
        return $response;
    }

    public static function addProduct($product) {
        
    }

    public static function getProductCategories() {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id, name FROM Product_category");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getProductManufacturers() {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id, name FROM Manufacturer");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getProductSubcategoryByCategoryId($categoryId) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id, name FROM Product_subcategory WHERE category_id = ?");
        $stmt->execute([$categoryId]);
        return $stmt->fetchAll();
    }

    public static function getCategoryTree() {
        $categories = self::getProductCategories();
        $categoryTree = [];
        foreach ($categories as $category) {
            $subcategories = self::getProductSubcategoryByCategoryId($category['id']);
            $categoryTree[] = [
                "id" => $category["id"],
                "name" => $category["name"],
                "subcategories" => $subcategories
            ];
        }
        return $categoryTree;
    }

}

