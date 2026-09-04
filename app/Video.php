<?php
require_once 'Database.php';


class Video extends Database {
    public function getVideos(?string $excludeId = null, ?string $playlistId = null): array {
        // Optional takes exclude id and playlist id
        try {
        $params = [];
        $query = 
        "SELECT v.*, 
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar
        FROM videos v
        JOIN users u ON v.uid = u.id";

        $where = [];
        if ($excludeId) {
            $where[] = "v.id != :exclude_id";
            $params['exclude_id'] = $excludeId;
        }
        if ($playlistId) {
            $where[] = "v.id NOT IN 
            (SELECT video_id FROM playlists_videos WHERE playlist_id = :p_id)";
            $params['p_id'] = $playlistId;
        }

        if (!empty($where)) {
            $query .= " WHERE " . implode(' AND ', $where);
        }

        $query .= " ORDER BY v.created DESC";

        
        $res = $this->pdo->prepare($query);
        $res->execute($params);
        $videos = $res->fetchAll(PDO::FETCH_ASSOC);

        return $videos;
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function getMyVideos() {
        $query = 
        "SELECT v.*, 
        u.username as uploader_name,
        u.login as uploader_link
        FROM videos v
        JOIN users u ON v.uid = u.id
        WHERE v.uid = :uid
        ORDER BY v.created DESC";


        $res = $this->pdo->prepare($query);
        $res->execute(['uid' => $_SESSION['uid']]);
        $videos = $res->fetchAll(PDO::FETCH_ASSOC);

        return $videos;
    }
    public function getVideo(string $id): object|bool {
        try {
        $query = 
        'SELECT v.*, 
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar,
        (SELECT COUNT(*) FROM rate WHERE video_id = v.id AND type = 1) as likes,
        (SELECT COUNT(*) FROM rate WHERE video_id = v.id AND type = 0) as dislikes
        FROM videos v
        JOIN users u ON v.uid = u.id
        WHERE v.id = :id';
        $res = $this->pdo->prepare($query);
        $res->bindValue(':id', $id);

        $res->execute();
        $video = $res->fetch(PDO::FETCH_OBJ);

        return $video;

        } catch (PDOException $e) {
            return false;
        } 
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
        (id, uid, thumb, video, title, duration) VALUES
        (:id, :uid, :thumb, :video, :title, :duration)';

        $res = $this->pdo->prepare($query);

        $res->bindValue(':id',       $videoId);
        $res->bindValue(':uid',  $_SESSION['uid']);
        $res->bindValue(':thumb',    'uploads/thumbs/' . $thumbName);
        $res->bindValue(':video',    'uploads/videos/' . $videoName);
        $res->bindValue(':title',    $data['title']);
        $res->bindValue(':duration', (int) $data['duration']);

        $res->execute();

        return ['success' => true, 'message' => 'video added, reloading...'];
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function delVideo($id): array {
        try {
            $uid = $_SESSION['uid'];

            $selectQuery = 
            "SELECT video, thumb FROM videos 
            WHERE id = :id AND uid = :uid";

            $stmt = $this->pdo->prepare($selectQuery);
            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':uid', $uid);
            $stmt->execute();

            $videoData = $stmt->fetch();

            if (empty($videoData)) {
                return ['success' => false, 'message' => 'Video not found or access denied'];
            }


            
            $query = 'DELETE FROM videos WHERE id = :id AND uid = :uid';
            $res = $this->pdo->prepare($query);
            $res->bindValue(':id', $id);
            $res->bindValue(':uid', $_SESSION['uid']);
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
    public function rate(int $type, string $video_id): array {
        try {
        $uid = $_SESSION['uid'];

        $check = $this->pdo->prepare(
        "SELECT u.id as uid, v.id as vid 
        FROM videos v
        JOIN users u ON u.id = :uid
        WHERE v.id = :vid"
        );
        $check->execute(['uid' => $uid, 'vid' => $video_id]);

        $isFound = $check->fetch(PDO::FETCH_ASSOC);

        if (!isset($isFound['uid']) || empty($isFound['uid'])) {
            return ['success' => false, 'message' => 'Undefined user'];
        }
        if (!isset($isFound['vid']) || empty($isFound['vid'])) {
            return ['success' => false, 'message' => 'Undefined video'];
        }



        $stmt = $this->pdo->prepare("SELECT type FROM rate 
        WHERE uid = :uid AND video_id = :video_id");
        $stmt->execute(['uid' => $uid, 'video_id' => $video_id]);

        $exist = $stmt->fetch();



        if ($exist) {
            if ((int)$exist['type'] == $type) {

                $del = $this->pdo->prepare("DELETE FROM rate WHERE
                uid = :uid AND video_id = :video_id");
                $del->execute([
                    'uid' => $uid,
                    'video_id' => $video_id
                ]);


                return ['success' => true, 'action' => "-"];
            } else {

                $upd = $this->pdo->prepare("UPDATE rate SET type = :type
                WHERE uid = :uid AND video_id = :video_id");
                $upd->execute([
                    'type' => $type, 
                    'uid' => $uid,
                    'video_id' => $video_id
                ]);


                return ['success' => true, 'action' => "+-"];
            }
        }



        $ins = $this->pdo->prepare("INSERT INTO rate (uid, video_id, type) 
        VALUES (:uid, :video_id, :type)");
        $ins->execute([
            'uid' => $uid, 
            'video_id' => $video_id,
            'type' => $type
        ]);
   

        return ['success' => true, 'action' => "+"];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
}