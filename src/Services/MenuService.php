<?php

namespace App\Services;

use App\Models\MenuModel;

class MenuService {
    public static function getUserMenu() {
        $userId = $_SESSION['user']['id'];
        $baseMenuItems = MenuModel::getBaseMenuItems();
        $userMenuItems = MenuModel::getCustomUserMenuItems($userId);
        $userMenu = self::mergeMenuItems($baseMenuItems, $userMenuItems);
        return $userMenu;
    }

    public static function updateUserMenu($userMenuItems) {
        $userId = $_SESSION['user']['id'];
        foreach ($userMenuItems as $userMenuItem) {
            if ($userMenuItem['isHidden'] == true) {
                MenuModel::addUserMenuItem($userId, $userMenuItem);
            }
            if ($userMenuItem['isHidden'] == false) {
                MenuModel::deleteUserMenuItem($userId, $userMenuItem);
            }
        }
        return self::getUserMenu();
    }

    private static function mergeMenuItems($baseMenuItems, $userMenuItems) {
        $mergedMenu = [];
        foreach ($baseMenuItems as $baseItem) {
            $itemId = $baseItem['menu_item_id'];
            $userItem = $userMenuItems[$itemId] ?? null;
            $mergedMenu[] = [
                "id" => $baseItem['menu_item_id'],
                "url" => $baseItem['menu_item_url'],
                "order" => $baseItem['item_order'],
                "isHidden" => $userItem['is_hidden'] ?? 0,
                "category" => [
                    "id" => $baseItem['category_id'],
                    "name" => $baseItem['category_name']
                ]
            ];
        }
        return $mergedMenu;
    }
}

