<?php
require_once 'Database.php';


class Video extends Database {
    public function getVideos(): array {
        $query = "SELECT id, thumb, title, views, created, user_id FROM videos";
        $res = $this->pdo->prepare($query);
        $res->execute();
        $videos = $res->fetchAll(PDO::FETCH_ASSOC);

        return $videos;
    }
    public function getVideo($id): object {
        $res = $this->pdo->prepare("SELECT video, title FROM videos WHERE id = :id");
        $res->bindValue(':id', $id);
        $res->execute();
        $video = $res->fetch(PDO::FETCH_OBJ);
        return $video;
    }
    public function addVideo($data): array {
        try {
        $title = $data['title'];
        $duration = $data['duration'];
        $thumb = $data['thumb'];
        $video = $data['video'];
        
        $videoId = substr(md5(uniqid()), 0, 11);

        $uploadDir = __DIR__ . '/../uploads/';
        $videoDir = $uploadDir . 'videos/';
        $thumbDir = $uploadDir . 'thumbs/';

        $videoExt = pathinfo($video['name'], PATHINFO_EXTENSION);
        $thumbExt = pathinfo($thumb['name'], PATHINFO_EXTENSION);

        $videoName = $videoId . '.' . $videoExt;
        $thumbName = $videoId . '.' . $thumbExt;

        if (!move_uploaded_file($video['tmp_name'], $videoDir . $videoName)) {
            throw new Exception('Save video error');
        }
        if (!move_uploaded_file($thumb['tmp_name'], $thumbDir . $thumbName)) {
            throw new Exception('Save thumb error');
        }

        $query = 'INSERT INTO videos (id, thumb, video, title, duration) 
        VALUES (:id, :thumb, :video, :title, :duration)';

        $res = $this->pdo->prepare($query);

        $res->bindValue(':id', $videoId);
        $res->bindValue(':thumb', 'uploads/thumbs/' . $thumbName);
        $res->bindValue(':video', 'uploads/videos/' . $videoName);
        $res->bindValue(':title', htmlspecialchars($title));
        $res->bindValue(':duration', (int) $duration);

        $res->execute();

        return ['success' => true, 'message' => 'video added'];
        } catch(Exception $error) {
            return ['success' => false, 'message' => $error];
        }
    }
}