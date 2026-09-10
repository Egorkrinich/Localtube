<?php
    $dbVideo = new Video();
    $searchQuery = $_GET['search'];

    $res = $dbVideo->search($searchQuery);

    // echo '<pre>';
    // print_r($res);
    // print_r($searchQuery);
    // echo '</pre>';

    // exit;
    require_once 'general/header.php';
    require_once 'general/sidebar.php';  
?>

<main class="content search">  
    <div class="search__header f-row-between">
        <h1 class="search__title">
            Result: <?php echo $searchQuery; ?>
        </h1>
    </div>
    <div class="manager__list f-column">
    <?php
        if (isset($res) && !empty($res)) :
            foreach ($res as $video) :
    ?>
    <a class="preview preview--horizontal" href="watch?v=<?php echo $video['id']?>">
        <div class="preview__thumb">
            <img src="<?php echo BASE_URL . $video['thumb']?>" alt="">
        </div>
        <div class="preview__body f-row">
            <div class="preview__left">
                <div class="avatar">
                    <img src="<?php echo BASE_URL . $video['uploader_avatar'] ?>" alt="">
                </div>
            </div>
            <div class="preview__center">
                    <h3 class="preview__title">
                        <?php echo htmlspecialchars($video['title'])?>
                    </h3>
                    <div class="preview__uploader">
                        <?php echo htmlspecialchars($video['uploader_name'])?>
                    </div>
                    <div class="preview__stats">
                        <?php echo $video['views']; ?> views • 
                        <?php echo $video['created']?>
                    </div>
            </div>
            <div class="preview__right">
                <button class="context-btn" data-context-btn data-context-id="<?php echo $video['id']?>">
                    <svg height="24" viewBox="0 0 24 24" width="24">
                        <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </a> 
    <?php endforeach; endif; ?>
    </div>
</main>

<?php
    require_once 'general/footer.php';
?>
