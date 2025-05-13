<?php

namespace App\Db;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        $hostname = "lamp-mysql8";
        $dbname = "php-mysql";
        $port = "3306";

        $dsn = "mysql:host={$hostname};port={$port};dbname={$dbname}";
        $username = "dev";
        $password = "123";
        try {
            $this->connection = new PDO($dsn, $username, $password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        }
        catch (PDOException $e) {
            die('Connection failed: ' . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (Database::$instance === null) {
            Database::$instance = new Database();
        }
        return Database::$instance;
    }

    public function getConnection(): PDO {
        return $this->connection;
    }

}

