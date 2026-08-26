<div class="burger" data-menu="burger">
    <div class="burger__header f-row-between">
        <button class="burger-btn f-column-between" data-menu-btn="burger">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <a href="<?php echo BASE_URL; ?>" class="burger__logo">
            <div class="burger__logo f-row">
                <span>LocalTube</span>
            </div>
        </a>
    </div>
    <div class="burger__section">
        <ul class="burger__list">
            <li class="burger__item">
                <a href="<?php echo BASE_URL; ?>" class="burger__link f-row active">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Home
                    </span>
                </a>
            </li>
            <li class="burger__item">
                <a href="#" class="burger__link f-row">
                    <span class="burger__item-text">
                        Followed
                    </span>
                    <div class="burger__arrow f-row">
                        <svg width="7" height="13" viewBox="0 0 7 13">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.58579 6.01318L0.292893 1.72029C-0.0976311 1.32977 -0.0976311 0.696601 0.292893 0.306077C0.683418 -0.0844469 1.31658 -0.0844469 1.70711 0.306077L6.70711 5.30608C7.09763 5.6966 7.09763 6.32977 6.70711 6.72029L1.70711 11.7203C1.31658 12.1108 0.683418 12.1108 0.292893 11.7203C-0.0976311 11.3298 -0.0976311 10.6966 0.292893 10.3061L4.58579 6.01318Z"/>
                        </svg>
                    </div>
                </a>
                <!-- <ul class="burger__accordion">
                    <li class="burger__item">
                        <a href="" class="burger__link f-row">
                            <div class="burger__avatar avatar">
                                <img src="./assets/images/user-test.png" alt="">
                            </div>
                            <span class="burger__item-text">
                                Test test
                            </span>
                        </a>
                    </li>
                </ul> -->
            </li>
        </ul>
    </div>
    <div class="separator"></div>
    <div class="burger__section">
        <h3 class="burger__title">Your tools</h3>
        <ul class="burger__list">
            <li class="burger__item">
                <a href="<?php echo BASE_URL; ?>manager" class="burger__link f-row">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Uploads manager
                    </span>
                </a>
            </li>
            <li class="burger__item">
                <a href="<?php echo BASE_URL; ?>history" class="burger__link f-row">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Watching history
                    </span>
                </a>
            </li>
            <li class="burger__item">
                <a href="#" class="burger__link f-row">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Zm520 520v-320l240 160-240 160Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Playlists
                    </span>
                </a>
            </li>
            <li class="burger__item">
                <a href="#" class="burger__link f-row">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Watch Later
                    </span>
                </a>
            </li>
            <li class="burger__item">
                <a href="#" class="burger__link f-row">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Liked
                    </span>
                </a>
            </li>
            <!-- <li class="burger__item">
                <a href="#" class="burger__link f-row">
                    <svg width="24px" height="24px" viewBox="0 -960 960 960">
                        <path d="M240-440h360v-80H240v80Zm0-120h360v-80H240v80Zm-80 400q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/>
                    </svg>
                    <span class="burger__item-text">
                        Videos control
                    </span>
                </a>
            </li> -->
        </ul>
    </div>
</div>