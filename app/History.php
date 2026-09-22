<?php
require_once 'Database.php';

class History extends Database {
    public function addHistory() {
        if (!isset($_SESSION['uid']) || !isset($_GET['v'])) return;

        $query = 'INSERT INTO history (uid, video_id) VALUES 
        (:uid, :video_id)
        ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP
        ';
        $res = $this->pdo->prepare($query);

        $res->bindValue(':uid', $_SESSION['uid']);
        $res->bindValue(':video_id', $_GET['v']);

        $res->execute();
    }
    public function getHistory(): array {
        $query = 
        "SELECT v.*,
        u.username as uploader_name,
        u.login as uploader_link,
        u.avatar as uploader_avatar
        FROM history h
        JOIN videos v ON v.id = h.video_id
        JOIN users u ON u.id = v.uid
        WHERE h.uid = :uid
        ORDER BY h.viewed_at DESC";

        $res = $this->pdo->prepare($query);

        $res->bindValue(':uid', $_SESSION['uid']);

        $res->execute();

        $videos = $res->fetchAll(PDO::FETCH_ASSOC);
        return $videos;
    }
}