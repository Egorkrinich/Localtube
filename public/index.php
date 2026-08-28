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
                    $exclude = '';
                    if (isset($_GET['v']) && !empty($_GET['v'])) {
                        $exclude = $_GET['v'];
                    }
                    $videos = $dbVideo->getVideos($exclude);

                    
                    echo json_encode($videos);
                exit;
                case 'getMyVideos':
                    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Unathorized'
                        ]);
                        exit;
                    }
                    $videos = $dbVideo->getMyVideos();

                    
                    echo json_encode($videos);
                exit;
                case 'addVideo':
                    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Unathorized'
                        ]);
                        exit;
                    }

                    if (!isset($_FILES['video']) || $_FILES['video']['error'] > 0) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Unexpected video error'
                        ]);
                        exit;
                    };
                    if (!isset($_FILES['thumb']) ||  $_FILES['thumb']['error'] > 0) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Unexpected thumb error'
                        ]);
                        exit;
                    };

                    $title    = trim($_POST['title'] ?? '');
                    $duration = $_POST['duration'] ?? '';
                    $thumb    = $_FILES['thumb'];
                    $video    = $_FILES['video'];

                    if (empty($title)) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Title must be filled'
                        ]);
                        exit;
                    }
                    if (mb_strlen($title) > 100) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Title is too long'
                        ]);
                        exit;
                    }
                    if (empty($duration)) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Cannot count video duration'
                        ]);
                        exit;
                    }

                    $res = $dbVideo->addVideo([
                        'title' => $title,
                        'duration' => $duration,
                        'thumb' => $thumb,
                        'video' => $video,
                    ]);            

                    
                    echo json_encode($res);
                exit;
                case 'delVideo':
                    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                        echo json_encode(['success' => false, 'message' => 'Unathorized']);
                        exit;
                    }
                    if (empty($_POST['id'])) {
                        echo json_encode(['success' => false, 'message' => 'Please send video id']);
                        exit;
                    }
                    
                    $res = $dbVideo->delVideo($_POST['id']);

                    echo json_encode($res);
                exit;
                case 'rate':
                    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Unathorized'
                        ]);
                        exit;
                    }

                    $action  = mb_strtolower(trim($_GET['action'] ?? ''));
                    $videoId = trim($_GET['videoId'] ?? '');

                    if (!isset($action) || empty($action)) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Unexpected Error'
                        ]);
                        exit;
                    }
                    if ($action !== 'like' && $action !== 'dislike') {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Unexpected Error'
                        ]);
                        exit;
                    }
                    if (!isset($videoId) || empty($videoId)) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Needed video id for interact'
                        ]);
                        exit;
                    }
                    $type = $action === 'like' ? 1 : 0;
                    $res = $dbVideo->rate($type, $videoId);

                    echo json_encode($res);
                exit;
            }
        exit;
        case 'Users':
            $dbUser = new User();

            switch ($action) {
                case 'register':
                    $requiredFields = [
                    'username', 'login', 
                    'password', 'passConfirm'
                    ];
                    $data = [];

                    foreach ($requiredFields as $field) {
                        $value = trim($_POST[$field] ?? '');

                        if (empty($value)) {
                            echo json_encode([
                                'success' => false,
                                'message' => 'Required field are missing or empty' 
                            ]);
                            exit;
                        }

                        $data[$field] = $value;
                    }

                    if ($data['password'] !== $data['passConfirm']) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Passwords do not match']);
                        exit;
                    }
                    $res = $dbUser->register($data);

                    echo json_encode($res);

                exit;
                case 'login':
                    $login    = mb_strtolower(trim($_POST['login'] ?? ''));
                    $password = trim($_POST['password'] ?? '');

                    if ((empty($login) || empty($password))) {
                        echo json_encode([
                            'success' => false, 
                            'message' => 'Please fill all requested fields']);
                        exit;
                    }

                    $res = $dbUser->login([ 
                    'login' => $login,
                    'password' => $password
                    ]);

                    echo json_encode($res);
                exit;
                case 'update':
                    if (empty($_POST) && empty($_FILES)) {
                        echo json_encode(['success' => false, 'message' => 'Empty fields']);
                        exit;
                    }
                    $data = $_POST;
                    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
                        $data['avatar'] = $_FILES['avatar'];
                    }
                    $res = $dbUser->update($data);
                    echo json_encode($res);
                exit;
                case 'logout':
                    session_unset();
                    session_destroy();

                    if (isset($_COOKIE[session_name()])) {
                        setcookie(session_name(), '', time() - 3600, '/');
                    }
                    
                    echo json_encode(['success' => true, 'message' => 'logout successful, reloading...']);

                exit;
            }
        exit;
        case 'History':
            $dbHistory = new History();
            
            switch ($action) {
                case 'getHistory': 
                    $videos = $dbHistory->getHistory(10, 0);
                    echo json_encode($videos);
                exit;
            }
        exit;
        case 'Playlist':
            $dbPlaylist = new Playlist();

            switch($action) {
                case 'createPlaylist':
                    $name = (string)trim($_POST['title'] ?? '');
                    $type = (string)mb_strtolower(trim($_POST['type'] ?? ''));

                    if (empty($_POST['title']) || empty($_POST['type'])) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Title or Type empty'
                        ]);
                        exit;
                    }
                    if ($type !== 'global' && $type !== 'private') {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Invalid type'
                        ]);
                        exit;
                    }

                    $res = $dbPlaylist->createPlaylist([
                        'title' => $name,
                        'type' => $type
                    ]);

                    echo json_encode($res);

                exit;
                case 'addToPlaylist':
                    $video_id = trim($_POST['video_id'] ?? '');
                    $playlist_id = trim($_POST['playlist_id'] ?? '');
                    if (empty($playlist_id) || empty($video_id)) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Id empty'
                        ]);
                        exit;
                    }

                    $res = $dbPlaylist->addToPlaylist([
                        'playlist_id' => $playlist_id,
                        'video_id' => $video_id
                    ]);

                    echo json_encode($res);
                exit;
            }

        exit;
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
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL);
            exit;
        }
        $styles = ASSETS[$path];

        
        require_once '../parts/manager-page.php';
    exit;
    case 'history':
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL);
            exit;
        }
        $styles = ASSETS[$path];

        
        require_once '../parts/history-page.php';
    exit;
    case 'playlists':
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL);
            exit;
        }
        $styles = ASSETS[$path];

        require_once '../parts/playlists-page.php';
    exit;
}   