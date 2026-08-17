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

            return ['success' => true, 'message' => 'successful registration'];
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

            return ['success' => true, 'message' => 'login successful'];
        }
        return ['success' => false, 'message' => 'Incorrect username or password'];
}
}