<?php
require_once 'Database.php';


class Playlist extends Database {
    public function createPlaylist(array $data): array {
        try {
        $id = $this->getUniqidId('playlists');
        $uid = $_SESSION['uid'];

        $res = $this->pdo->prepare("INSERT 
        INTO playlists (id, uid, title, type) 
        VALUES (:id, :uid, :title, :type)");

        $res->execute([
            'id' => $id,
            'uid' => $uid,
            'title' => $data['title'],
            'type' => $data['type']
        ]);


        return ['success' => true, 'message' => 'Playlist created'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function getPlaylistsModal(): array|bool {
        $uid = $_SESSION['uid'];
        
        $res = $this->pdo->prepare("SELECT id, title 
        FROM playlists WHERE uid = :uid");
        $res->execute(['uid' => $uid]);
        $playlists = $res->fetchAll(PDO::FETCH_ASSOC);

        return $playlists;
    } 
    public function addToPlaylist(array $data): array {
        try {
        $uid = $_SESSION['uid'];

        $check = $this->pdo->prepare("SELECT 
        p.id AS p_exists, 
        v.id AS v_exists,
        (SELECT IFNULL(MAX(position), 0) 
        FROM playlists_videos 
        WHERE playlist_id = p.id) AS last_pos,

        (SELECT COUNT(*) FROM playlists_videos 
        WHERE playlist_id = p.id AND video_id = v.id) AS already_exists

        FROM playlists p
        CROSS JOIN videos v
        WHERE p.id = :p_id AND v.id = :v_id AND p.uid = :uid
        LIMIT 1;");

        $check->execute([
            'p_id' => $data['playlist_id'],
            'v_id' => $data['video_id'],
            'uid' => $uid
        ]);
        $isExist = $check->fetch();

        if (!$isExist) {
            return ['success' => false, 'message' => 'Playlist or video not found'];
        }

        if ($isExist['already_exists'] > 0) {
            return ['success' => false, 'message' => 'Already in playlist'];
        }

        $newPos = (int)$isExist['last_pos'] + 1;

        $res = $this->pdo->prepare("INSERT INTO playlists_videos 
        (playlist_id, video_id, position) VALUES (:p_id, :v_id, :pos)");
        $res->execute([
            'p_id' => $data['playlist_id'], 
            'v_id' => $data['video_id'],
            'pos' => $newPos
        ]);

        
        return ['success' => true, 'message' => 'Added to playlist'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected Error'];
        }
    }
    public function getPlaylists() {
        $query = "SELECT
        p.id as playlist_id, p.title, u.username,

        (SELECT video_id FROM playlists_videos 
        WHERE playlist_id = p.id ORDER BY position ASC LIMIT 1) as video_id,

        (SELECT v.thumb FROM videos v
        JOIN playlists_videos pv ON v.id = pv.video_id
        WHERE pv.playlist_id = p.id ORDER BY pv.position ASC LIMIT 1) as thumb

        FROM playlists p
        JOIN users u ON u.id = p.uid
        WHERE p.uid = :uid OR p.type = 'public'";
        
        $res = $this->pdo->prepare($query);
        $res->execute(['uid' => $_SESSION['uid']]);
        $playlists = $res->fetchAll(PDO::FETCH_ASSOC);

        return $playlists;
    }
    public function getPlaylist(string $playlistId) {
        try {
        $info = $this->getPlaylistAndUserInfo($playlistId, 
        ['id', 'title', 'type', 'username', 'avatar' , 'amount']);
        
        if (!$info) {
            return ['success' => false, 'message' => 'Undefined playlist'];
        }     
        $res = $this->pdo->prepare("SELECT
        pv.position,
        v.*, 
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar

        FROM playlists_videos pv
        JOIN videos v ON v.id = pv.video_id
        JOIN users u On u.id = v.uid
        WHERE pv.playlist_id = :p_id
        ORDER BY pv.position ASC");

        $res->execute(['p_id' => $playlistId]);
        $videos = $res->fetchAll(PDO::FETCH_ASSOC);

        return ['info' => $info, 'videos' => $videos];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function editPlaylist(string $id, array $videos, array $data): array {
        try {
        $response = [
            'success' => false,
        ];
        $keys = array_keys($data);
        $keys[] = "uid";
        $info = $this->getPlaylistAndUserInfo($id, $keys);

        if (!isset($info) || empty($info)) {
            return ['success' => false, 'message' => 'Undefined playlist'];
        }
        if ($info['uid'] !== $_SESSION['uid']) {
            return ['success' => false, 'message' => 'Access denied'];
        }

        $this->pdo->beginTransaction(); 

        $updateParams = [];

        foreach ($data as $key => $value) {
            switch ($key) {
                case 'title':
                    if ($value === $info['title']) {
                        $response['warnings'][] = 'New title must not match with old';
                        break;
                    }
                    $updateParams['title'] = $value;
                break;
                case 'type':
                    if ($value === $info['type']) {
                        $response['warnings'][] = 'Same type';
                        break;
                    }
                    $updateParams['type'] = $value;
                break;
            }
        }
        if (!empty($updateParams)) {
            $updQuery = "UPDATE playlists SET " 
            . implode(',', array_map(function($k) { return "{$k} = :{$k}"; }, 
            array_keys($updateParams))) . " WHERE id = :id";

            $upd = $this->pdo->prepare($updQuery);
            $response['updatedFields'] = array_keys($updateParams);

            $updateParams['id'] = $id;
            $upd->execute($updateParams);
            $response['success'] = true;
        }


        if (!empty($videos)) {
            
        $params = [];
        $rows = [];
        
        $index = 1;
        foreach($videos as $video) {
            if ((bool) $video['deleted'] === false) {
                $rows[] = "(:p{$index}, :v{$index}, :pos{$index})";

                $params["p{$index}"]   = $id;
                $params["v{$index}"]   = $video['id'];
                $params["pos{$index}"] = $index;

                $index++;
            }
        }
        
        $del = $this->pdo->prepare("DELETE FROM playlists_videos 
        WHERE playlist_id = :p_id");
        $del->execute(['p_id' => $id]);

        $response['videosMessage'] = 'Playlist Cleared';
        if (!empty($rows)) {
            $ins = $this->pdo->prepare("INSERT INTO playlists_videos 
            (playlist_id, video_id, position) 
            VALUES " . implode(', ', $rows));
            $ins->execute($params);
            $response['videosMessage'] = 'Positions changed';
        }
            $response['success'] = true;
        }
        


        $this->pdo->commit();
        return $response;
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function deletePlaylist(string $id): array {
        try {
        $query = "DELETE FROM playlists WHERE id = :id AND uid = :uid";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            'id' => $id,
            'uid' => $_SESSION['uid']
        ]);
                    
        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Playlist deleted'];
        }
                    
        return ['success' => false, 'message' => 'Playlist not found or access denied'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }

    private function getPlaylistAndUserInfo(string $playlistId, array $params): array|bool {
        $rows = [];
        foreach($params as $param) {
            switch($param) {
                case "username":
                    $rows[] = "u.username";
                break;
                case "avatar":
                    $rows[] = "u.avatar";
                break;
                case "uid":
                    $rows[] = "u.id as uid";
                break;
                case "amount":
                    $rows[] = "(SELECT COUNT(*) 
                    FROM playlists_videos WHERE playlist_id = p.id) as amount";
                break;
                default:
                    $rows[] = "p.{$param}";
                    break;
            }
        }
        try {
        $res = $this->pdo->prepare("SELECT " 
        . implode(", ", $rows) . 
        " FROM playlists p 
        JOIN users u ON u.id = p.uid
        WHERE p.id = :p_id");

        $res->execute(['p_id' => $playlistId]);
        $info = $res->fetch(PDO::FETCH_ASSOC);


        return $info;
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
}