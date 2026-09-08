<div class="user" data-menu="user">
    <div class="user__header f-row">
        <div class="avatar f-row-center">
            <img src="<?php echo $avatar; ?>" alt="">
        </div>

        <div class="user__meta">
            <div class="user__name"><?php echo htmlspecialchars($username); ?></div>
            <a class="user__link" href="#">View uploaded</a>
        </div>
    </div>

    <ul class="user__control f-column">
        <li><button class="control__button f-row" data-menu-btn="settings">
            Settings
        </button></li>
        <li><button class="control__button f-row">
            Lang
        </button></li>
        <li><button class="control__button f-row">
            Theme
        </button></li>
        <li><button class="control__button f-row">
            Upload
        </button></li>
    </ul>
</div>