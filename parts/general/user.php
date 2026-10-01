<div class="user" data-menu="user">
    <div class="user__header f-row">
        <div class="avatar f-row-center">
            <img src="<?= $avatar; ?>" alt="">
        </div>

        <div class="user__details">
            <div class="user__name">
                <?= htmlspecialchars($username); ?>
            </div>
            <a class="user__link" href="#">
                View uploaded
            </a>
        </div>
    </div>

    <div class="user__options f-column">
        <button class="user-options__button f-row" data-menu-btn="settings">
            Settings
        </button>
        <button class="user-options__button f-row">
            Lang
        </button>
        <details class="user-options__menu">
            <summary class="user-options__button f-row">
                Theme
            </summary>

            <ul class="user-menu__content">
                <li>
                    <button data-theme-btn="dark">
                        Dark
                    </button>
                </li>
                <li>
                    <button data-theme-btn="light">
                        Light
                    </button>
                </li>
            </ul>
        </details>
        <button class="user-options__button f-row">
            Upload
        </button>
    </div>
</div>