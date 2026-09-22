<?php
require_once 'Database.php';


class Video extends Database {
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
        $res->bindValue(':uid',      $_SESSION['uid']);
        $res->bindValue(':thumb',    'uploads/thumbs/' . $thumbName);
        $res->bindValue(':video',    'uploads/videos/' . $videoName);
        $res->bindValue(':title',    $data['title']);
        $res->bindValue(':duration', (int) $data['duration']);

        $res->execute();

        return ['success' => true, 'message' => 'Video added, reloading...'];
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function editVideo(string $id, array $data): array {
        $props = [];

        try {
        $response = ['success' => false, 'updated' => [], 'warnings' => []];

        $uid = $_SESSION['uid'];

        $details = $this->getVideo($id, ['id', 'uid', 'title', 'thumb']);

        if (!isset($details) || empty($details)) {
            return ['success' => false, 'message' => 'Undefined video'];
        }
        if ($details['uid'] !== $uid) {
            return ['success' => false, 'message' => 'Access denied'];
        }

        $params = [];

        foreach ($data as $key => $value) {
            switch ($key) {
                case 'title':
                    if ($value === $details['title']) {
                        $response['warnings'][] = 'New title must not match with old';
                        break;
                    }
                    if (mb_strlen($value) > 100) {
                        $response['warnings'][] = 'Title is too long';
                        break;
                    }
                    $params['title'] = $value;
                break;
                case 'thumb':
                    $ext = $this->getMimeExt($value, 'image');

                    if (!$ext['success']) {
                        $props['warnings'][] = $ext['message'];
                        break;
                    }
                    $dir = __DIR__ . '/../uploads/thumbs/';

                    $oldThumb = $details['thumb'];
                    $oldExt = pathinfo($oldThumb, PATHINFO_EXTENSION);

                    $filename = $details['id'] . '.' . $ext['ext'];
                    
                    if ($oldThumb && ($oldExt === $ext['ext'])) {
                        $oldThumbPath = __DIR__ . '/../' . $oldThumb;
                        
                        if (file_exists($oldThumbPath)) {
                            unlink($oldThumbPath); 
                            move_uploaded_file($value['tmp_name'], $dir . $filename);
                            $response['success']   = true;
                            $response['updated'][] = 'thumb';
                        } else {
                            $response['warnings'][] = 'Upload thumb error';
                        }
                        break;
                    }
                    $tempFilename = $details['id'] . '_temp' . '.' . $ext['ext'];

                    $props['thumb']['filePath']  = $dir . $filename;
                    $props['thumb']['tFilePath'] = $dir . $tempFilename;
                    
                    if (move_uploaded_file($value['tmp_name'], $dir . $tempFilename)) {
                        $params['thumb'] = 'uploads/thumbs/' . $filename;
                    } else {
                        $response['warnings'][] = 'Upload thumb error';
                    }
                break;
            }
        }
        if (!empty($params)) {
            $updQuery = "UPDATE videos SET " 
            . implode(',', array_map(function($k) { return "{$k} = :{$k}"; }, 
            array_keys($params))) . " WHERE id = :id";

            $upd = $this->pdo->prepare($updQuery);
            
            $response['updated'] = array_merge($response['updated'], 
            array_keys($params));

            $params['id'] = $id;
            $upd->execute($params);
            $response['success'] = true;

            if (isset($params['thumb'])) {
                $oldThumb = $details['thumb'];

                if ($oldThumb) {
                    $oldThumbPath = __DIR__ . '/../' . $oldThumb;
                    
                    if (file_exists($oldThumbPath)) unlink($oldThumbPath);
                    rename($props['thumb']['tFilePath'], $props['thumb']['filePath']);
                }
            }
        }

    
        return $response;
        } catch (PDOException $e) {
            if (isset($props['thumb']) && !empty($props['thumb']['tempFilename'])) {
                unlink($props['thumb']['tFilePath']);
            }
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function delVideo(string $id): array {
        try {
        $uid = $_SESSION['uid'];

        $sel = $this->pdo->prepare("SELECT video, thumb 
        FROM videos WHERE id = :id AND uid = :uid");

        $sel->execute(['id' => $id, 'uid' => $uid]);
        $videoData = $sel->fetch();

        if (empty($videoData)) {
            return [
                'success' => false, 
                'message' => 'Video not found or access denied'
            ];
        }

        $del = $this->pdo->prepare("DELETE FROM videos 
        WHERE id = :id AND uid = :uid");

        $del->execute(['id' => $id, 'uid' => $uid]);
        
        if ($del->rowCount() > 0) {
            $path = __DIR__ . '/../';
            $videoFile = $path . $videoData['video'];
            $thumbFile = $path . $videoData['thumb'];
            if (file_exists($videoFile)) unlink($videoFile); 
            if (file_exists($thumbFile)) unlink($thumbFile);

            
            return [
                'success' => true, 
                'message' => 'Video deleted successfully, reloading...'
            ];
        }


        return [
            'success' => false, 
            'message' => 'Video not found or access denied'
        ];
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }

    public function getVideo(string $id, array $params = []): array|bool {
        try {
        if (empty($id) || empty($params)) $params[] = 'standard';

        $rename = [
            'username' => 'uploader_name',
            'login' => 'uploader_login', 
            'avatar' => 'uloader_avatar'
        ];
        
        $joinUsers = false;
        $rows = [];
        foreach ($params as $param) {
            switch ($param) {
                case 'standard':
                    $rows[] = "
                    v.id, v.thumb, v.video, v.title, v.views, v.duration, v.created, 
                    u.username as uploader_name,
                    u.login as uploader_login,
                    u.avatar as uploader_avatar,
                    (SELECT COUNT(*) FROM rate WHERE video_id = v.id AND type = 1) as likes,
                    (SELECT COUNT(*) FROM rate WHERE video_id = v.id AND type = 0) as dislikes
                    ";
                    $joinUsers = true;
                break;
                case 'username':
                case 'login':
                case 'avatar':
                    $rows[] = "u.{$param}" . " as {$rename[$param]}" ?? '';
                    $joinUsers = true;
                break;
                case 'likes':
                    $rows[] = "(SELECT COUNT(*) FROM rate WHERE video_id = v.id AND type = 1) as likes";
                break;
                case 'dislikes':
                    $rows[] = "(SELECT COUNT(*) FROM rate WHERE video_id = v.id AND type = 0) as dislikes";
                break;
                default:
                    $rows[] = "v.{$param}";
                break;
            }
        }
        if ($joinUsers) $joinUsers = "JOIN users u ON v.uid = u.id ";
        $query = 'SELECT ' .
        implode(', ', $rows) 
        . ' FROM videos v ' . $joinUsers . 'WHERE v.id = :id';
        $res = $this->pdo->prepare($query);

        $res->execute(['id' => $id]);
        $video = $res->fetch(PDO::FETCH_ASSOC);

        return $video;
        } catch (PDOException $e) {
            return false;
        } 
    }
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

        $query .= " ORDER BY RAND()";

        
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
        u.login as uploader_link,
        u.avatar as uploader_avatar
        FROM videos v
        JOIN users u ON v.uid = u.id
        WHERE v.uid = :uid
        ORDER BY v.created DESC";


        $res = $this->pdo->prepare($query);
        $res->execute(['uid' => $_SESSION['uid']]);


        $videos = $res->fetchAll(PDO::FETCH_ASSOC);

        return $videos;
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
    public function search(string $q) {
        try {
        $q = trim($q);
        if (empty($q)) return [];

        $words = explode(' ', $q);

        $whereParts = [];
        $params = [];

        foreach ($words as $index => $word) {
            $paramName = "w" . $index;

            $whereParts[] = "v.title LIKE :{$paramName}";
            $params[$paramName] = "%" . $word . "%";
        }

        $sqlWhere = implode(' OR ', $whereParts);

        $query = "SELECT v.*, 
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar
        FROM videos v
        JOIN users u ON v.uid = u.id
        WHERE {$sqlWhere}";

        $res = $this->pdo->prepare($query);
        $res->execute($params);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);


        return $result;
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function addView(string $id, ?string $uid = null) {
        try {
        if (!ALLOW_DUPLICATE_VIEWS && !empty($uid)) {
            $sel = $this->pdo->prepare('SELECT * 
            FROM views WHERE video_id = :vid AND uid = :uid');

            $sel->execute(['vid' => $id, 'uid' => $uid]);
            $res = $sel->fetch(PDO::FETCH_ASSOC);
            if (!empty($res)) return;
        }

        $this->pdo->beginTransaction();

        $upd = $this->pdo->prepare('UPDATE videos 
        SET views = views + 1 WHERE id = :id');
        $upd->execute(['id' => $id]);

        $ins = $this->pdo->prepare('INSERT 
        INTO views (video_id, uid) VALUES (:id, :uid)
        ON DUPLICATE KEY UPDATE amount = amount + 1');
        

        $ins->execute(['id' => $id, 'uid' => $uid]);

        $this->pdo->commit();
        return;
        } catch(PDOException $e) {
            $this->pdo->rollBack();
            return;
        }
    }
}