<?php
    require_once 'general/header.php';
    require_once 'general/sidebar.php';
    require_once 'general/burger.php';
?>

<main class="content content--upload">  
    <form action="" class="upload" enctype="multipart/form-data" id="upload">
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
</main>

<?php
    require_once 'general/footer.php';
?>
