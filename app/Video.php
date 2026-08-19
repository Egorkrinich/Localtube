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

        $query = 'INSERT INTO videos (id, user_id, thumb, video, title, duration) 
        VALUES (:id, :user_id, :thumb, :video, :title, :duration)';

        $res = $this->pdo->prepare($query);

        $res->bindValue(':id', $videoId);
        $res->bindValue(':user_id', $_SESSION['user_id']);
        $res->bindValue(':thumb', 'uploads/thumbs/' . $thumbName);
        $res->bindValue(':video', 'uploads/videos/' . $videoName);
        $res->bindValue(':title', htmlspecialchars($title));
        $res->bindValue(':duration', (int) $duration);

        $res->execute();

        return ['success' => true, 'message' => 'video added, reloading...'];
        } catch(Exception $error) {
            return ['success' => false, 'message' => $error];
        }
    }
    public function delVideo($id): array {
        try {
            $user_id = $_SESSION['user_id'];

            $selectQuery = 
            "SELECT video, thumb FROM videos 
            WHERE id = :id AND user_id = :user_id";

            $stmt = $this->pdo->prepare($selectQuery);
            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();

            $videoData = $stmt->fetch();

            if (empty($videoData)) {
                return ['success' => false, 'message' => 'Video not found or access denied'];
            }


            
            $query = 'DELETE FROM videos WHERE id = :id AND user_id = :user_id';
            $res = $this->pdo->prepare($query);
            $res->bindValue(':id', $id);
            $res->bindValue(':user_id', $_SESSION['user_id']);
            $res->execute();
            
            if ($res->rowCount() > 0) {

                $path = __DIR__ . '/../';

                $videoFile = $path . $videoData['video'];
                $thumbFile = $path . $videoData['thumb'];

                if (file_exists($videoFile)) {
                    unlink($videoFile);
                }
                if (file_exists($thumbFile)) {
                    unlink($thumbFile);
                }               

                return ['success' => true, 'message' => 'Video deleted successfully, reloading...'];
            } else {
                return ['success' => false, 'message' => 'Video not found or access denied'];
            }
        } catch(PDOException $error) {
            return [
                'success' => false, 
                'message' => 'Database error: ', $error->getMessage()
                ];
        }
    }
}