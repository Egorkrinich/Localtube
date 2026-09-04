<?php
require_once 'Database.php';

class User extends Database {
    public function register(array $data): array {
        try {
        $fields = [];

        foreach ($data as $key => $value) {
            switch ($key) {
                case 'username':
                    if (mb_strlen($value) < 3) {
                        return [
                            'success' => false,
                            'message' => 'Username is too short'
                        ];
                    }
                    if (mb_strlen($value) > 30) {
                        return [
                            'success' => false,
                            'message' => 'Username is too long'
                        ];
                    }

                    $fields['username'] = $value;
                break;
                case 'login':
                    if (mb_strlen($value) < 3) {
                        return [
                            'success' => false,
                            'message' => 'Login is too short'
                        ];
                    }
                    if (mb_strlen($value) > 30) {
                        return [
                            'success' => false,
                            'message' => 'Login is too long'
                        ];
                    }
                    // Check for Latin chars

                    $fields['login'] = mb_strtolower($value);

                break;
                case 'password':
                    if (mb_strlen($value) < 10) {
                        return [
                            'success' => false,
                            'message' => 'Password is too short'
                        ];
                    }
                    if (mb_strlen($value) > 40) {
                        return [
                            'success' => false,
                            'message' => 'Passwords is too long'
                        ];
                    }
                    // Check for Latin chars

                    $passHash = password_hash($value, PASSWORD_DEFAULT);
                    $fields['hash'] = $passHash;
                break;
            }
        }
        
        $id = '';
        $isIdUniqid    = false;
        
        $isFieldsUniqid = false;
        while (!$isIdUniqid) {
            $params = [];
            $newId = substr(md5(uniqid()), 0, 11);
            
            if (!$isFieldsUniqid) $params['login'] = $fields['login'];
            $params['id'] = $newId; 
            
            $res = $this->checkDuplicate($params);

            if (isset($res['success']) && $res['success'] === 'notFound') {
                $isIdUniqid = true;
                $id = $newId;
                break;
            }
            if ($isFieldsUniqid) continue;
            if (in_array('login', $res)) {
                return [
                    'success' => false, 
                    'message' => 'This login is already taken'
                ];
            } else {
                $isFieldsUniqid = true;
            }
        }

        $query = 
        "INSERT INTO users (id, username, login, hash) 
        VALUES (:id, :username, :login, :hash)";

        $res = $this->pdo->prepare($query);

        $res->bindValue(':id', $id);
        $res->bindValue(':username', $fields['username']);
        $res->bindValue(':login', $fields['login']);
        $res->bindValue(':hash', $fields['hash']);

        $res->execute();


        $_SESSION['uid']   = $id;
        $_SESSION['login'] = $fields['login'];

        return ['success' => true, 'message' => 'Successful registration, reloading...'];

        } catch (PDOException $error) {
            if ($error->getCode() == 23000) {
                return ['success' => false, 'message' => 'This login is already taken'];
            }
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function login(array $data): array {
        $login    = $data['login'];
        $password = $data['password'];

        $res = $this->getUserData(
            ['id', 'username', 'avatar', 'login', 'hash'],
            'login',
            $login);

        if (isset($res['success']) && $res['success'] === false) return $res;

        if (empty($res['hash']) || !password_verify($password, $res['hash'])) {
            return ['success' => false, 'message' => 'Incorrect username or password'];
        }

            
        $_SESSION['uid']  = $res['id'];
        $_SESSION['login']    = $res['login'];
        
        return ['success' => true, 'message' => 'Login successful, reloading...'];
    }
    public function update(array $data) {
        try {
        $userData = $this->getUserData(['hash', 'avatar', 'username'], 'id');

        // Response fields, errors and fields
        $resFields = [];
        $resErrors = [];

        $fields = [];

        foreach($data as $key => $value) {
            switch($key) {
                case 'username':
                    if (empty($value) || (mb_strlen($value) < 3)) {
                        $resErrors[] = [
                            'key' => 'username',
                            'message' => 'Username empty or too short'
                        ];
                        break;
                    }
                    if (mb_strlen($value) > 30) {
                        $resErrors[] = [
                            'key' => 'username',
                            'message' => 'Username too long'
                        ];
                        break;
                    }
                    if ($value === $userData['username']) {
                        $resErrors[] = [
                            'key' => 'username',
                            'message' => 'New username not must match with old'
                        ];
                        break;
                    }

                    $fields[] = [
                        'key' => 'username',
                        'query' => "`username` = :username",
                        'newValue' => $value
                    ];
                    $resFields[] = 'username';
                break;
                case 'avatar':
                    $ext = $this->getMimeExt($value, 'image');

                    if (!$ext['success']) {
                        $resErrors[] = [
                            'key' => 'avatar',
                            'message' => $ext['message']
                        ];
                        break;
                    }

                    $uploadDir = __DIR__ . '/../uploads/avatars/';

                    $avatarId = substr(md5(uniqid("", true)), 0, 20);
                    $filename = $avatarId . "_" . time() . '.'. $ext['ext'];

                    // Deleting old avatar
                    $oldAvatar = $userData['avatar'];
                    if ($oldAvatar && str_starts_with($oldAvatar, 'uploads/avatars/')) {
                        $oldAvatarPath = __DIR__ . '/../' . $oldAvatar;
                        if (file_exists($oldAvatarPath)) unlink($oldAvatarPath); 
                    }

                    // Saving new one
                    if (move_uploaded_file($value['tmp_name'], $uploadDir . $filename)) {
                        $fields[] = [
                            'key' => 'avatar',
                            'query' => '`avatar` = :avatar',
                            'newValue' => 'uploads/avatars/' . $filename
                        ];
                        $resFields[] = 'avatar';
                    } else {
                        $resErrors[] = [
                            'key' => 'avatar',
                            'message' => 'Failed to save file'
                        ];
                    }
                break;
                case 'password':
                    if (empty($value) || (mb_strlen($value) < 10)) {
                        $resErrors[] = [
                            'key' => 'password', 
                            'message' => 'Password empty or too short'
                        ];
                        break;
                    }
                    if (strlen($value) > 40) {
                        $resErrors[] = [
                            'key' => 'password',
                            'message' => 'Password too long'
                        ];
                        break;
                    }
                    if (password_verify($value, $userData['hash'])) {
                        $resErrors[] = [
                            'key' => 'password',
                            'message' => 'New password not must match with old'
                        ];
                        break;
                    }

                    $fields[] = [
                        'key' => 'hash',
                        'query' => "`hash` = :hash",
                        'newValue' => password_hash($value, PASSWORD_DEFAULT)
                    ];
                    $resFields[] = 'password';
                break;
            }
        }
        
        if (count($fields) <= 0) return ['success' => false, 'errors' => $resErrors];
        
        $query = "UPDATE users SET "
        . implode(', ', array_column($fields, 'query'))
        . " WHERE id = :uid";

        $stmt = $this->pdo->prepare($query);
        
        foreach ($fields as $field) {
            $stmt->bindValue(":" . $field["key"], $field["newValue"]);
        }
        $stmt->bindValue(':uid', $_SESSION['uid']);
        $stmt->execute();

        return [
            'success' => true,
            'fields' => $resFields,
            'errors' => $resErrors
        ];
            
        } catch (PDOException) {
            return ['success' => false, 'message' => 'Unexpected error'];
        } catch (Exception) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    public function getUserData(array $params, string $by, ?string $login = null): array {
        try {
        $bindValue = $by === 'id' ? $_SESSION['uid'] : $login;

        $query = "SELECT " . implode(', ', $params) . 
        " FROM users WHERE {$by} = :{$by}";

        $res = $this->pdo->prepare($query);
        $res->bindValue(':' . $by, $bindValue);
        $res->execute();


        $result = $res->fetch(PDO::FETCH_ASSOC);

        
        return $result ?: [];
        } catch (PDOException) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
    private function checkDuplicate(array $params): array {
        try {
        $queries = array_map(function($k) { 
            return "`$k` = :$k"; 
        }, array_keys($params));
          
        $query = "SELECT " . implode(', ', array_keys($params)) .
        " FROM users WHERE " . implode(' OR ', $queries);
        $res = $this->pdo->prepare($query);

        foreach ($params as $key => $value) { 
            $res->bindValue(":".$key, $value);
        }
        $res->execute();
        
        $result = $res->fetch(PDO::FETCH_OBJ);
        
        if (!$result) {
            return ['success' => "notFound"];
        }
        
        $duplicates = [];
        foreach ($result as $key => $value) {
            if (isset($params[$key]) && $value == $params[$key]) {
                $duplicates[] = $key;
            }
        };

        return $duplicates;
        } catch (PDOException) {
            return ['success' => false, 'message' => 'Unexpected error'];
        }
    }
}   