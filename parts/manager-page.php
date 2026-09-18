<?php
    require_once 'general/header.php';
    require_once 'general/sidebar.php';
?>
<form class="m-upload modal-menu" enctype="multipart/form-data" id="upload" data-menu="upload">
    <div class="m-upload__step m-upload__step--1 f-column">
        <div class="m-upload__header modal-menu__header">
            <h3 class="m-upload__title">Select video</h3>
        </div>

        <div class="m-upload__body f-row-center">
            <input type="file" name="video" accept="video/mp4" required>
        </div>
    </div>
    
    <div class="m-upload__step m-upload__step--2 f-column">
        <div class="m-upload__header f-row-between modal-menu__header">
            <h3 class="m-upload__title">Title and thumb</h3>
            <button class="m-upload__submit btn--primary" type="submit">
                Upload
            </button>
        </div>
        
        <div class="m-upload__body f-column">
            <div class="m-upload__field f-column">
                <label for="title">Video title</label>
                <input name="title" class="input--primary" type="text"
                placeholder="video title" maxlength="100" required>
            </div>

            <div class="m-upload__field f-column">
                <label for="thumb">Video thumb</label>
                <input name="thumb" class="m-upload__thumb" 
                accept="image/*" type="file" required>
                <div class="m-upload__thumb-container" data-manager-thumb-cont></div>
            </div>

        </div>
    </div>
</form>

<main class="manager content" data-page>
    <!-- General page menu -->

    <div class="manager__page page-menu" data-page-menu="default">
        <div class="manager__header f-row-between">
            <h1 class="manager__title">
                Video manager
            </h1>
            <button class="manager__button btn--secondary" data-menu-btn="upload">
                Add video
            </button>
        </div>

        <div class="manager__body f-column" id="preview-container"></div>
    </div>

    <!-- Secondary page menu -->

    <form class="m-edit page-menu" data-page-menu="edit" id="edit" enctype="multipart/form-data">
        <div class="m-edit__header page-menu__header f-row">
            <button data-page-menu-btn="edit" type="button">
                <svg width="24px" height="24px" viewBox="0 -960 960 960">
                    <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
                </svg>
            </button>
            <h2 class="m-edit__title">Edit video</h2>
            <button class="m-edit__submit btn--primary" type="submit">Save</button>
        </div>

        <div class="m-edit__body f-column">
            <div class="m-edit__field f-column">
                <label for="title">Title</label>
                <input name="title" class="input--primary" 
                maxlength="100" type="text">
            </div>
            <div class="m-edit__field f-column">
                <label for="thumb">Thumb</label>
                <input name="thumb" type="file" accept="image/*">
                <div class="m-edit__thumb-container f-row" data-manager-thumb-cont></div>
            </div>
        </div>
    </form>
</main>

<?php
    require_once 'general/footer.php';
?>
