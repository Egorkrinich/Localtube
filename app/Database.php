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
    // public function initAll() {
    //     $this->initUsers();
    //     $this->initVideos();
    //     $this->initHistory();
    //     $this->initVideoRate();
    //     $this->initPlaylist();
    // }
    // public function initVideos() {
    //     $res = $this->pdo->prepare(
    //     'CREATE TABLE videos (
    //     id VARCHAR(25) NOT NULL PRIMARY KEY,
    //     user_id VARCHAR(25) NOT NULL,
    //     thumb VARCHAR(255) NOT NULL,
    //     video VARCHAR(255) NOT NULL,
    //     title VARCHAR(100) NOT NULL,
    //     views BIGINT(20) UNSIGNED DEFAULT 0,
    //     duration INT UNSIGNED DEFAULT 0,
    //     created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
    //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    //     '
    //     );
    //     $res->execute();
    // }
    // public function initUsers() {
    //     $query = 
    //     'CREATE TABLE users (
    //     id VARCHAR(25) NOT NULL PRIMARY KEY,
    //     username VARCHAR(30) NOT NULL DEFAULT "user",
    //     avatar VARCHAR(255) DEFAULT "assets/images/default-avatar.png",
    //     login VARCHAR(30) NOT NULL UNIQUE,
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
    //         user_id VARCHAR(25) NOT NULL,
    //         video_id VARCHAR(25) NOT NULL ,
    //         viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //         PRIMARY KEY (user_id, video_id) 
    //         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    //     ';
    //     $res = $this->pdo->prepare($query);
    //     $res->execute();
    // }
    // public function initVideoRate() {
    //     $query =
    //     'CREATE TABLE rate (
    //         user_id VARCHAR(25) NOT NULL,
    //         video_id VARCHAR(25) NOT NULL,
    //         type TINYINT(1) NOT NULL,
    //         PRIMARY KEY (user_id, video_id),
    //         CONSTRAINT fk_video_rate 
    //         FOREIGN KEY (video_id) 
    //         REFERENCES videos (id) 
    //         ON DELETE CASCADE
    //         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    //     ';
    //     $res = $this->pdo->prepare($query);
    //     $res->execute();
    // }
    // public function initPlaylist() {
        // $res = $this->pdo->prepare("CREATE TABLE playlists (
        // id VARCHAR(25) NOT NULL,
        // uid VARCHAR(25) NOT NULL,
        // title VARCHAR(100) NOT NULL,
        // type ENUM('global', 'private'),

        // PRIMARY KEY (id, uid)

        // ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        // $res->execute();

        // $res2 = $this->pdo->prepare("CREATE TABLE playlists_videos (
        // playlist_id VARCHAR(25) NOT NULL,
        // video_id VARCHAR(25) NOT NULL,
        // position INT NOT NULL DEFAULT 0,

        // PRIMARY KEY (playlist_id, video_id),

        // CONSTRAINT fk_playlist
        // FOREIGN KEY (playlist_id)
        // REFERENCES playlists (id) ON DELETE CASCADE,

        // CONSTRAINT fk_video_in_playlist 
        // FOREIGN KEY (video_id) 
        // REFERENCES videos (id) ON DELETE CASCADE

        // ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        // $res2->execute(); 
    // }

    
    protected function getMimeExt($file, string $type): array {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorRes = [ 'success' => false ];
            switch ($file['error']) {
                case UPLOAD_ERR_INI_SIZE: 
                    $errorRes['message'] = 'File is too big';
                break;
                case UPLOAD_ERR_PARTIAL: 
                    $errorRes['message'] = 'File loaded partially';
                break;
                case UPLOAD_ERR_NO_FILE:
                    $errorRes['message'] = 'File not loaded';
                break;
                default: 
                    $errorRes['message'] = 'Unexpected file error'; 
                break;
            }
            return $errorRes;
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        $allowed = [
            'image' => [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/avif' => 'avif'
                ],
            'video' => ['video/mp4' => 'mp4']
        ];
        if (!array_key_exists($mimeType, $allowed[$type])) {
            return [
                'success' => false,
                'message' => 
                'Invalid file type. Only '
                . implode(', ', $allowed[$type]) .
                ' are allowed.'
            ];
        }

        return [ 'success' => true, 'ext' => $allowed[$type][$mimeType] ];
    }
    protected function getUniqidId(string $tableName, ?bool $isUniqid = true): string {
        $id = '';

        if (!$isUniqid) {
            $id = substr(md5(uniqid('', true)), 0, 25);
            return $id;
        }

        $query = "SELECT id FROM " . $tableName . " WHERE id = :id";

        $isIdUniqid = false;
        while (!$isIdUniqid) {
            $newId = substr(md5(uniqid('', true)), 0, 25);

            $res = $this->pdo->prepare($query);
            $res->bindValue(':id', $newId);
            $res->execute();

            $result = $res->fetch(PDO::FETCH_ASSOC);

            if (!(bool)$result) {
                $isIdUniqid = true;
                $id = $newId;
                break;
            }
        }

        return $id;
    }
}