<?php
require_once '../config.php';


class Database {
    protected string $host = DB_HOST;
    protected string $name = DB_NAME;
    protected string $login = DB_USER;  
    protected string $password = DB_PASS;
    protected ?PDO $pdo;

    public function __construct() {
        $this->pdo = new PDO("mysql:host={$this->host};dbname={$this->name};port=3306",
        $this->login,
        $this->password);
    }
    // public function initTable() {
    //     $res = $this->pdo->prepare(
    //     'CREATE TABLE videos (
    //     id VARCHAR(15) NOT NULL PRIMARY KEY,
    //     user_id INT(15) UNSIGNED NOT NULL DEFAULT 1,
    //     thumb VARCHAR(255) NOT NULL,
    //     video VARCHAR(255) NOT NULL,
    //     title VARCHAR(100) NOT NULL,
    //     views BIGINT(20) UNSIGNED DEFAULT 0,
    //     duration INT UNSIGNED DEFAULT 0,
    //     created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
    //     )
    //     '
    //     );
    //     $res->execute();
    //     return $res;
    // }
}