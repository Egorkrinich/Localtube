<?php
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    $avatar = $_SESSION['avatar'];
    $login = $_SESSION['login'];
}
$videoData = '';
if (isset($likes) && isset($dislikes)) {
    $videoData = "const VIDEO_DATA = {likes: $likes, dislikes: {$dislikes}}";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php foreach ($styles as $style) : ?>
        <link rel="stylesheet" href="<?php echo BASE_URL;?>assets/styles/css/<?php echo $style?>">
    <?php endforeach ?>
    <script>
        const BASE_URL = '<?php echo BASE_URL; ?>';

        <?php echo $videoData; ?>

        const USER_CONFIG = {
            isLoggedIn: <?php echo isset($_SESSION['user_id']) ? 'true' : 'false' ?>
        };
    </script>
</head>
<body>
    <div id="overlay"></div>
    <div class="context" id="context-menu"></div>
    <div class="f-column-center" id="toast"></div>
    <?php
        require_once 'burger.php'; 

        if (isset($user_id)) {

            require_once 'user.php';
            require_once 'settings.php';

        } else {

            require_once 'auth.php';

        }
    ?>
    <header class="header f-row-between">
        <div class="header__left f-row-between">
            <button class="burger-btn btn--secondary f-column-between" data-menu-btn="burger">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <a class="header__logo" href="/Localtube">
                <div class="header__logo f-row">
                    <span>Localtube</span>
                </div>
            </a>
        </div>
        <div class="header__search f-row-center">
            <div class="search__wrapper">
                <input type="text" class="search__input input--primary" placeholder="Search...">
            </div>
            <button class="search__btn f-row-center btn--secondary" aria-label="Search">
                <svg height="24px" width="24px" viewBox="0 -960 960 960">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
            </button>
        </div>
        <div class="header__right f-row-between">
            <?php if (isset($user_id)) : ?>
                <button class="header__notification f-row-center btn--secondary">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
                    </svg>
                </button>
                
                <button class="avatar f-row-center" data-menu-btn="user" data-no-overlay>
                    <img src="<?php echo $avatar; ?>" alt="">
                </button>
            <?php else :?>
                <button class="header__auth-button" data-menu-btn="auth">Authorization</button>
            <?php endif; ?>
        </div>
    </header>