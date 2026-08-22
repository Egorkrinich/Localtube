<?php
require_once 'Database.php';

class User extends Database {
    public function register(array $data): array {
        $id = substr(md5(uniqid()), 0, 11);
        $login = trim($data['login']);
        $password = trim($data['password']);

        $passHash = password_hash($password, PASSWORD_DEFAULT);

        $query = "INSERT INTO users (id, login, hash) VALUES
        (:id, :login, :hash)";

        $res = $this->pdo->prepare($query);

        $res->bindValue(':id', $id);
        $res->bindValue(':login', $login);
        $res->bindValue(':hash', $passHash);

        try {
            $res->execute();

            $_SESSION['user_id'] = $id;
            $_SESSION['user_login'] = $login;

            return ['success' => true, 'message' => 'successful registration, reloading...'];
        } catch (PDOException $error) {
            if ($error->getCode() == 23000) {
                return ['success' => false, 'message' => 'This login is already taken'];
            }
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function login(array $data): array {
        $login = $data['login'];
        $password = $data['password'];
        
        $query = "SELECT id, login, hash FROM users WHERE login = :login";
        $res = $this->pdo->prepare($query);

        $res->bindValue(':login', $login);

        $res->execute();

        $user = $res->fetch(PDO::FETCH_OBJ);

        if ($user && password_verify($password, $user->hash)) {
            
            $_SESSION['user_id'] = $user->id;
            $_SESSION['user_login'] = $user->login; 

            return ['success' => true, 'message' => 'login successful, reloading...'];
        }
        return ['success' => false, 'message' => 'Incorrect username or password'];
    }
    public function update(array $data): array {
        try {
        $hash = $this->getData(['hash']);

        $fields = [];
        $errors = [];

        foreach($data as $key => $value) {
            switch($key) {
                case 'password':
                    if (empty($value) || (strlen($value) < 10)) {
                        $errors[] = [
                            'key' => $key, 
                            'message' => 'password empty or too short'
                        ];
                        break;
                    }
                    if (password_verify($value, $hash['hash'])) {
                        $errors[] = [
                            'key' => $key,
                            'message' => 'new password not must match with old'
                        ];
                        break;
                    }
                    $fields[] = [
                        'key' => 'hash',
                        'query' => "`hash` = :hash",
                        'newValue' => password_hash($value, PASSWORD_DEFAULT)
                    ];
                break;
            }
        }
        
        if (count($fields) <= 0) return ['success' => false, 'errors' => $errors];
        
        $query = "UPDATE users SET "
        . implode(', ', array_column($fields, 'query'))
        . " WHERE id = :user_id";

        $stmt = $this->pdo->prepare($query);
        
        foreach ($fields as $field) {
            $stmt->bindValue(":" . $field["key"], $field["newValue"]);
        }
            $stmt->bindValue(':user_id', $_SESSION['user_id']);

            $stmt->execute();

            return [
                'success' => true,
                'fields' => array_column($fields, 'key'),
                'errors' => $errors
            ];
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    private function getData(array $params): array {
        $query = "SELECT " . implode(', ', $params) . 
        " FROM users WHERE id = :id";

        $res = $this->pdo->prepare($query);
        $res->bindValue(':id', $_SESSION['user_id']);

        $res->execute();
        return $res->fetch(PDO::FETCH_ASSOC);
    }
}