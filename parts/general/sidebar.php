<aside class="sidebar">
    <a href="<?php echo BASE_URL; ?>" class="sidebar__link f-column-center">
        <svg width="24px" height="24px" viewBox="0 -960 960 960">
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
        </svg>
        <span class="sidebar__text">
            Home
        </span>
    </a>
    <a href="" class="sidebar__link f-column-center">
        <svg width="24px" height="24px" viewBox="0 -960 960 960">
            <path d="M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h640q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H160Zm0-80h640v-400H160v400Zm240-40 240-160-240-160v320ZM160-680v-80h640v80H160Zm120-120v-80h400v80H280ZM160-160v-400 400Z"/>
        </svg>
        <span class="sidebar__text">
            Followed
        </span>
    </a>
    <a href="<?php echo BASE_URL; ?>manager" class="sidebar__link f-column-center">
        <div class="avatar">
            <img src="<?php echo $avatar ?? DEFAULT_AVATAR; ?>" alt="">
        </div>
        <span class="sidebar__text">
            Uploaded
        </span>
    </a>
</aside>