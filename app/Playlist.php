<?php
require_once 'Database.php';


class Playlist extends Database {
    public function createPlaylist(array $data): array {
        try {
        $id = $this->getUniqidId('playlists');
        $uid = $_SESSION['user_id'];

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
        $uid = $_SESSION['user_id'];
        
        $res = $this->pdo->prepare("SELECT id, title 
        FROM playlists WHERE uid = :uid");
        $res->execute(['uid' => $uid]);
        $playlists = $res->fetchAll(PDO::FETCH_ASSOC);

        return $playlists;
    } 
    public function addToPlaylist(array $data): array {
        try {
        $uid = $_SESSION['user_id'];

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

}