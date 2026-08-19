<?php

$lifetime = 30 * 24 * 60 * 60; 
session_set_cookie_params($lifetime);
ini_set('session.gc_maxlifetime', $lifetime);

define('BASE_URL', "http://" . $_SERVER['HTTP_HOST'] . "/Localtube/");

define('DB_HOST', 'localhost');
define('DB_NAME', 'localtube');
define('DB_USER', 'root');
define('DB_PASS', 'root');

define('ASSETS', [
    'home' => [
        'utility.css',
        'main.css',
    ],
    'watch' => [
        'utility.css',
        'main.css',
        'watch.css',
    ],
    'manager' => [
        'utility.css',
        'main.css',
        'manager.css',
    ],
    'history' => [
        'utility.css',
        'main.css',
        'history.css',
    ]
]);
// ini_set('display_errors', 1); 
// ini_set('display_startup_errors', 1); 
// error_reporting(E_ALL);