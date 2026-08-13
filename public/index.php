<?php
require_once '../config.php';
require_once '../app/Database.php';
require_once '../app/Video.php';

$dbVideo = new Video;

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/Localtube/', '', $path);

if (str_starts_with($path, 'API')) {
    $API = str_replace('API/', '', $path);
    header('Content-Type: application/json');

    switch ($API) {
        case 'getVideos':

            $videos = $dbVideo->getVideos();
            echo json_encode($videos);
            exit;

        case 'addVideo':

            if (!isset($_FILES['video']) || $_FILES['video']['error'] > 0) return;
            if (!isset($_FILES['thumb']) ||  $_FILES['thumb']['error'] > 0) return;

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
    case 'upload':
        $styles = ASSETS[$path];
        
        require_once '../parts/upload-page.php';
}   