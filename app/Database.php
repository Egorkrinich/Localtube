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
    // public function initVideos() {
    //     $res = $this->pdo->prepare(
    //     'CREATE TABLE videos (
    //     id VARCHAR(15) NOT NULL PRIMARY KEY,
    //     user_id INT(15) UNSIGNED NOT NULL DEFAULT 1,
    //     thumb VARCHAR(255) NOT NULL,
    //     video VARCHAR(255) NOT NULL,
    //     title VARCHAR(100) NOT NULL,
    //     views BIGINT(20) UNSIGNED DEFAULT 0,
    //     duration INT UNSIGNED DEFAULT 0,
    //     created  
    //     )
    //     '
    //     );
    //     $res->execute();
    // }
    // public function initUsers() {
    //     $query = 
    //     'CREATE TABLE users (
    //     id VARCHAR(15) NOT NULL PRIMARY KEY,
    //     login VARCHAR(20) NOT NULL UNIQUE,
    //     hash VARCHAR(255) NOT NULL,
    //     registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
    //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    //     ';
    //     $res = $this->pdo->prepare($query);
    //     $res->execute();
    // }
    // public function initHistory() {
    //     $query =
    //     'CREATE TABLE history (
    //         user_id VARCHAR(15) NOT NULL,
    //         video_id VARCHAR(15) NOT NULL ,
    //         viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //         PRIMARY KEY (user_id, video_id) 
    //         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    //     ';
    //     $res = $this->pdo->prepare($query);
    //     $res->execute();
    // }
}