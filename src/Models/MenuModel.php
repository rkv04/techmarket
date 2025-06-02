<?php

namespace App\Models;

use App\Db\Database;

class MenuModel {
    public static function getBaseMenuItems() {
        $db = Database::getInstance()->getConnection();
        $query = "SELECT mi.id AS menu_item_id, 
                            mi.url AS menu_item_url, 
                            mi.item_order, 
                            pc.id AS category_id, 
                            pc.name AS category_name 
                  FROM Menu_item mi
                        LEFT JOIN Product_category pc ON mi.category_id = pc.id 
                        ORDER BY mi.item_order ASC ";
        $stmt = $db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getCustomUserMenuItems($userId) {
        $db = Database::getInstance()->getConnection();
        $query = "SELECT menu_item_id, is_hidden 
                        FROM Menu_item_override 
                        WHERE user_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$userId]);
        $userMenuItems = $stmt->fetchAll();
        $result = [];
        foreach ($userMenuItems as $row) {
            $result[$row['menu_item_id']] = $row;
        }
        return $result;
    }

    public static function addUserMenuItem($userId, $userMenuItem) {
        $db = Database::getInstance()->getConnection();
        $query = "INSERT INTO Menu_item_override (user_id, menu_item_id, is_hidden) 
                            VALUES (:userId, :menuItemId, :isHidden)
                            ON DUPLICATE KEY UPDATE is_hidden = VALUES(is_hidden)";
        $stmt = $db->prepare($query);
        $stmt->execute([
            "userId" => $userId,
            "menuItemId" => $userMenuItem['id'],
            "isHidden" => $userMenuItem["isHidden"]
        ]);
    }

    public static function deleteUserMenuItem($userId, $userMenuItem) {
        $db = Database::getInstance()->getConnection();
        $query = "DELETE FROM Menu_item_override WHERE user_id = ? AND menu_item_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$userId, $userMenuItem["id"]]);
    }
}

