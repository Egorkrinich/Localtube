<div class="user" data-menu="user">
    <div class="user__channel f-row">

        <div class="avatar f-row-center">
                <img src="./assets/images/user-test.png" alt="">
        </div>

        <div class="user__info">
            <div class="user__name"><?php echo $_SESSION['user_login']; ?></div>
            <a href="#" class="user__link">View uploaded</a>
        </div>
        
    </div>

    <ul class="user__control f-column">
        <li>
            <button class="control__button f-row" data-menu-btn="settings">
                Settings
            </button>
        </li>
        <li>
            <button class="control__button f-row">
                Lang
            </button>
        </li>
        <li>
            <button class="control__button f-row">
                Theme
            </button>
        </li>
        <li>
            <button class="control__button f-row">
                Upload
            </button>
        </li>
    </ul>
</div>