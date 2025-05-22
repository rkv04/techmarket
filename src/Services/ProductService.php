<?php

namespace App\Services;

use App\Models\ProductModel;

class ProductService {
    public static function getProducts($queryParams) {
        $preparedQueryParams = self::prepareQueryParams($queryParams);
        $products = ProductModel::getProducts($preparedQueryParams);
        return $products;
    }

    private static function prepareQueryParams($queryParamsRaw) {
        $filters = [
            'page' => $queryParamsRaw['page'] ?? 1,
            'limit' => $queryParamsRaw['limit'] ?? 10,
            'type' => $queryParamsRaw['type'] ?? null,
            'manufacturer' => $queryParamsRaw['manufacturer'] ?? null,
            'country' => $queryParamsRaw['country'] ?? null,
            'price_min' => $queryParamsRaw['price_min'] ?? null,
            'price_max' => $queryParamsRaw['price_max'] ?? null,
            'available' => $queryParamsRaw['available'] ?? null,
            'sort' => $queryParamsRaw['sort'] ?? 'id',
            'order' => $queryParamsRaw['order'] ?? 'ASC',
            'search' => $queryParamsRaw['search'] ?? null
        ];

        $filters['limit'] = max(1, min(100, (int)$filters['limit']));
        $filters['page'] = max(1, (int)$filters['page']);
        $validSortColumns = ['id', 'price', 'name'];
        $filters['sort'] = in_array($filters['sort'], $validSortColumns) ? $filters['sort'] : 'id';
        $filters['order'] = strtoupper($filters['order']) === 'DESC' ? 'DESC' : 'ASC';
        if (isset($filters['available'])) {
            $filters['available'] = $filters['available'] === 'true' ? 'true' : null;
        }
        if (isset($filters['country'])) {
            $filters['country'] = strtoupper($filters['country']);
        }
        return $filters;
    }
}

