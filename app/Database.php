<?php
require_once '../config.php';


class Database {
    private string $host = DB_HOST;
    private string $name = DB_NAME;
    private string $login = DB_USER;  
    private string $password = DB_PASS;
    private ?PDO $pdo;

    public function __construct() {
        $this->pdo = new PDO("mysql:host={$this->host};dbname={$this->name};port=3306",
        $this->login,
        $this->password);
    }
    // public function query($sql) {
    //     $stmt = $this->pdo->prepare($sql);
    //     $stmt->execute();
    //     return $stmt;
    // }

}