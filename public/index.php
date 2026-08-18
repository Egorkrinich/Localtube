<?php
spl_autoload_register(function ($class_name) {
    $file = '../app/' . $class_name . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});
require_once '../config.php';
session_start();


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/Localtube/', '', $path);

if (str_starts_with($path, 'API')) {
    header('Content-Type: application/json');

    $parts = explode('/', str_replace('API/', '', $path));
    $group = $parts[0] ?? '';
    $action = $parts[1] ?? '';

    switch ($group) {
        case 'Videos':
            $dbVideo = new Video();

            switch ($action) {
                case 'getVideos':
                    $videos = $dbVideo->getVideos();
                    echo json_encode($videos);
                    
                break;
                case 'addVideo':
                    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                        echo json_encode(['success' => false, 'message' => 'Unathorized']);
                        exit;
                    }

                    if (!isset($_FILES['video']) || $_FILES['video']['error'] > 0) {
                        echo json_encode(['success' => false, 'message' => 'unexpected video error']);
                    };
                    if (!isset($_FILES['thumb']) ||  $_FILES['thumb']['error'] > 0) {
                        echo json_encode(['success' => false, 'message' => 'unexpected thumb error']);
                    };

                    $title = $_POST['title'];
                    $duration = $_POST['duration'];
                    $thumb = $_FILES['thumb'];
                    $video = $_FILES['video'];

                    $res = $dbVideo->addVideo([
                        'title' => $title,
                        'duration' => $duration,
                        'thumb' => $thumb,
                        'video' => $video,
                    ]);            

                    echo json_encode($res);

                break;
                case 'delVideo':
                    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                        echo json_encode(['success' => false, 'message' => 'Unathorized']);
                        exit;
                    }
                    if (empty($_POST['id'])) {
                        echo json_encode(['success' => false, 'message' => 'Please send video id']);
                    }
                    
                    $res = $dbVideo->delVideo($_POST['id']);

                    echo json_encode($res);
                break;
            }
        break;
        case 'Users':
            $dbUser = new User();

            switch ($action) {
                case 'register':
                    $login = $_POST['login'];
                    $password = $_POST['password'];
                    $passCorfirm = $_POST['passConfirm'];

                    if (!isset($login, $password, $passCorfirm)) {
                        echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
                    }
                    if ($password !== $passCorfirm) {
                        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
                    }
                    $res = $dbUser->register([
                        'login' => $login,
                        'password' => $password,
                    ]);

                    echo json_encode($res);

                break;
                case 'login':
                    $login = trim($_POST['login']);
                    $password = $_POST['password'];
                    if (!isset($login, $password) || (empty($login) && empty($password))) {
                        echo json_encode(['success' => false, 'message' => 'Please fill all requested fields']);
                        break;
                    }
                    $res = $dbUser->login([
                        'login' => $login,
                        'password' => $password
                    ]);
                    echo json_encode($res);

                break;
            }
        break;
        case 'History':
            $dbHistory = new History();
            
            switch ($action) {
                case 'getHistory': 
                    $videos = $dbHistory->getHistory(10, 0);
                    echo json_encode($videos);
                break;
            }
        break;
    }
}

switch ($path) {
    case '':
        $styles = ASSETS['home'];

        require_once '../parts/home-page.php';
        exit;
    case 'watch':
        if (!isset($_GET['v']) || empty($_GET['v'])) {
            header("Location: /Localtube/");
            exit;
        }
        $styles = ASSETS[$path];
        
        require_once '../parts/watch-page.php';
        exit;
    case 'manager':
        $styles = ASSETS[$path];
        
        require_once '../parts/manager-page.php';
        exit;
    case 'history':
        $styles = ASSETS[$path];
        
        require_once '../parts/history-page.php';
        exit;
}   