<?php

namespace App\Db;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        $env = parse_ini_file('/home/b/b93332pg/techmarket/.env');
        $hostname = $env['DB_HOST'];
        $dbname = $env['DB_NAME'];
        $port = "3306";
        $username = $env['DB_NAME'];
        $password = $env['DB_PASSWORD'];

        $dsn = "mysql:host={$hostname};port={$port};dbname={$dbname}";
        $this->connection = new PDO($dsn, $username, $password);
        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
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

