<?php
    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
        header('Location: /Localtube/');
        exit;
    }

    require_once 'general/header.php';
    require_once 'general/sidebar.php';
    require_once 'general/burger.php';

    
?>
<form action="" class="upload" enctype="multipart/form-data" id="upload" data-menu="upload">
    <div class="upload__step upload__step--1">
        <div class="upload__header">
            <h3 class="upload__title">
                Upload video
            </h3>
        </div>
        <div class="upload__body f-row-center">
            <input type="file" name="video" accept="video/mp4" required>
        </div>
    </div>
    
    <div class="upload__step upload__step--2">
        <div class="upload__header">
            <h3 class="upload__title">
                Title and thumb
            </h3>
        </div>
        <div class="upload__body f-column-center">
            <div class="upload__field upload__field--title">
                <input type="text" name="title" placeholder="video title" maxlength="100" required>
            </div>
            <div class="upload__field upload__field--thumb">
                <input class="upload__thumb" type="file" name="thumb" accept="image/*" required>
            </div>
            <button class="upload__submit" type="submit">upload</button>
        </div>
    </div>
</form>
<main class="content content--manager">  
    <div class="content__header f-row-between">
        <h1 class="content__title">
            Video manager
        </h1>
        <button class="content__button" data-menu-btn="upload">
            Add
        </button>
    </div>
    <div class="content__list f-row" id="preview-container"></div>
</main>

<?php
    require_once 'general/footer.php';
?>
