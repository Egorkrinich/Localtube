<?php
require_once 'Database.php';


class Search extends Database {
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
}