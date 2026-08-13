<?php

define('BASE_URL', "http://" . $_SERVER['HTTP_HOST'] . "/Localtube/");

define('DB_HOST', 'localhost');
define('DB_NAME', 'localtube');
define('DB_USER', 'root');
define('DB_PASS', 'root');

define('ASSETS', [
    'home' => [
        'main.css',
        'utility.css'
    ],
    'watch' => [
        'main.css',
        'utility.css',
        'watch.css'
    ],
    'upload' => [
        'main.css',
        'utility.css',
        'upload.css'
    ]
]);
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);