<?php
require_once 'Database.php';


class Video extends Database {
    public function getVideos(): array {
        $query = 
        "SELECT v.*, 
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar
        FROM videos v
        JOIN users u ON v.user_id = u.id
        ORDER BY v.created DESC";
        $res = $this->pdo->prepare($query);
        $res->execute();
        $videos = $res->fetchAll(PDO::FETCH_ASSOC);

        return $videos;
    }
    public function getVideo(string $id): object {
        $query = 
        'SELECT v.*, 
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar
        FROM videos v
        JOIN users u ON v.user_id = u.id
        WHERE v.id = :id';
        $res = $this->pdo->prepare($query);
        $res->bindValue(':id', $id);
        $res->execute();
        $video = $res->fetch(PDO::FETCH_OBJ);
        return $video;
    }
    public function addVideo(array $data): array {
        try {        
        $videoId = $this->getUniqidId('videos');

        $videoRes = $this->getMimeExt($data['video'], 'video');
        if (!$videoRes['success']) return $videoRes;

        $thumbRes = $this->getMimeExt($data['thumb'], 'image');
        if (!$thumbRes['success']) return $thumbRes;

        $uploadDir = __DIR__ . '/../uploads/';
        $videoDir = $uploadDir . 'videos/';
        $thumbDir = $uploadDir . 'thumbs/';

        $videoName = $videoId . '.' . $videoRes['ext'];
        $thumbName = $videoId . '.' . $thumbRes['ext'];

        if (!move_uploaded_file($data['video']['tmp_name'], $videoDir . $videoName)) {
            return ['success' => false, 'message' => 'Failed to save video'];
        }
        if (!move_uploaded_file($data['thumb']['tmp_name'], $thumbDir . $thumbName)) {
            return ['success' => false, 'message' => 'Failed to save thumb'];
        }

        $query = 'INSERT INTO videos 
        (id, user_id, thumb, video, title, duration) VALUES
        (:id, :user_id, :thumb, :video, :title, :duration)';

        $res = $this->pdo->prepare($query);

        $res->bindValue(':id',       $videoId);
        $res->bindValue(':user_id',  $_SESSION['user_id']);
        $res->bindValue(':thumb',    'uploads/thumbs/' . $thumbName);
        $res->bindValue(':video',    'uploads/videos/' . $videoName);
        $res->bindValue(':title',    $data['title']);
        $res->bindValue(':duration', (int) $data['duration']);

        $res->execute();

        return ['success' => true, 'message' => 'video added, reloading...'];
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error' . $e];
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