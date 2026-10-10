<?php
    $dbVideo = new Video();
    $searchQuery = $_GET['s'];

    $res = $dbVideo->search($searchQuery);
    
    require_once 'general/header.php';
?>

<main class="search headered">  
    <div class="search__header f-row-between">
        <h1 class="search__title">
            Result: <?= $searchQuery; ?>
        </h1>
    </div>
    <div class="search__body f-column" id="search-container"></div>
</main>

<?php
    require_once 'general/footer.php';
?>
