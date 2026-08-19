<?php
require_once 'Database.php';

class History extends Database {
    public function addHistory() {
        if (!isset($_SESSION['user_id']) || !isset($_GET['v'])) return;

        $query = 'INSERT INTO history (user_id, video_id) VALUES 
        (:user_id, :video_id)
        ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP
        ';
        $res = $this->pdo->prepare($query);

        $res->bindValue(':user_id', $_SESSION['user_id']);
        $res->bindValue(':video_id', $_GET['v']);

        $res->execute();
    }
    public function getHistory(int $limit, int $offset): array {
        $query = 
        "SELECT v.id, v.thumb, v.title, v.views, v.created, h.viewed_at
        FROM history h
        JOIN videos v ON h.video_id = v.id
        WHERE h.user_id = :user_id
        ORDER BY h.viewed_at DESC
        LIMIT :limit OFFSET :offset";
        $res = $this->pdo->prepare($query);

        $res->bindValue(':user_id', $_SESSION['user_id']);
        $res->bindValue(':limit', $limit, PDO::PARAM_INT);
        $res->bindValue(':offset', $offset, PDO::PARAM_INT);

        $res->execute();

        $videos = $res->fetchAll(PDO::FETCH_ASSOC);
        return $videos;
    }
}