<?php

namespace App\Models;

use App\Db\Database;

class ProductModel {
    public static function getProducts($queryParams) {
        $query = self::buildQuery($queryParams);
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare($query['sql']);
        $stmt->execute($query['params']);
        return $stmt->fetchAll();
    }

    private static function buildQuery($queryParams) {
        $sql = 'SELECT * FROM Product WHERE 1 = 1';
        $params = [];
        if ($queryParams['type']) {
            $sql .= ' AND type = :type';
            $params[':type'] = $queryParams['type'];
        }
        if ($queryParams['manufacturer']) {
            $sql .= ' AND manufacturer = :manufacturer';
            $params[':manufacturer'] = $queryParams['manufacturer'];
        }
        if ($queryParams['country']) {
            $sql .= ' AND country = :country';
            $params[':country'] = $queryParams['country'];
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
        if ($queryParams['search']) {
            $sql .= ' AND (name LIKE :search OR description LIKE :search)';
            $params[':search'] = '%' . $queryParams['search'] . '%';
        }
        $sql .= " ORDER BY {$queryParams['sort']} {$queryParams['order']}";
        $offset = ($queryParams['page'] - 1) * $queryParams['limit'];
        $sql .= " LIMIT {$queryParams['limit']} OFFSET $offset";
        
        return ['sql' => $sql, 'params' => $params];
    }
}