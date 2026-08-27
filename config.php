<?php

mb_internal_encoding("UTF-8");
session_set_cookie_params([
    'lifetime' => 30 * 24 * 60 * 60,
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'httponly' => true
]);
ini_set('session.gc_maxlifetime', 30 * 24 * 60 * 60);

define('BASE_URL', "http://" . $_SERVER['HTTP_HOST'] . "/Localtube/");

define('DB_HOST', 'localhost');
define('DB_NAME', 'localtube');
define('DB_USER', 'root');
define('DB_PASS', 'root');

define('DEFAULT_AVATAR', 'assets/images/default-avatar.png');

define('ASSETS', [
    'home' => [
        'core.css',
        'main.css',
    ],
    'watch' => [
        'core.css',
        'main.css',
        'watch.css',
    ],
    'manager' => [
        'core.css',
        'main.css',
        'manager.css',
    ],
    'history' => [
        'core.css',
        'main.css',
        'history.css',
    ]
]);
// ini_set('display_errors', 1); 
// ini_set('display_startup_errors', 1); 
// error_reporting(E_ALL);