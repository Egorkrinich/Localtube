<?php
require_once '../config.php';
require_once '../app/Database.php';

$db = new Database;

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/Localtube/', '', $path);

// if (str_starts_with($path, 'API')) {
//     $API = str_replace('API/', '', $path);

//     // switch ($path) {

//     // }
//     exit;
// }
// echo $_GET['']


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
}   