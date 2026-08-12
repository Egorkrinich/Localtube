<?php
    require_once 'general/header.php';
    require_once 'general/burger.php';
?>

<main class="content content--watch">
    <div class="content__video video">
        <div class="video__player player" id="video-player">
            <video src="<?php echo BASE_URL ?>uploads/videos/test.mp4" class="player__video" id="video"></video>
            <div class="player__control control">
                <div class="control__progress-bar" id="progress-bar">
                    <div class="control__progress-line" id="progress-line"></div>
                </div>
                <div class="control__container f-row-between">
                    <div class="control__left f-row">
                        <button class="player__btn toggle-btn" id="play-toggle">
                            <svg class="toggle__item toggle__item--inactive" width="30px" height="30px" fill="inherit" viewBox="0 0 36 36">
                                <path d="M 17 8.6 L 10.89 4.99 C 9.39 4.11 7.5 5.19 7.5 6.93 C 7.5 6.93 7.5 6.93 7.5 6.93 L 7.5 29.06 C 7.5 30.8 9.39 31.88 10.89 31 C 10.89 31 10.89 31 10.89 31 L 17 27.4 C 17 27.4 17 27.4 17 27.4 C 17 27.4 17 27.4 17 27.4 L 17 8.6 C 17 8.6 17 8.6 17 8.6 C 17 8.6 17 8.6 17 8.6 Z M 17 8.6 L 17 8.6 C 17 8.6 17 8.6 17 8.6 C 17 8.6 17 8.6 17 8.6 V 27.4 C 17 27.4 17 27.4 17 27.4 C 17 27.4 17 27.4 17 27.4 L 33 18 C 33 18 33 18 33 18 C 33 18 33 18 33 18 V 18 L 17 8.6 C 17 8.6 17 8.6 17 8.6 C 17 8.6 17 8.6 17 8.6 Z"></path>
                            </svg>
                            <svg class="toggle__item toggle__item--active" width="30px" height="30px" fill="inherit" viewBox="0 0 36 36">
                                <path d="M 12.75 4.5 L 9.75 4.5 C 9.15 4.5 8.58 4.73 8.15 5.15 C 7.73 5.58 7.5 6.15 7.5 6.75 L 7.5 29.25 C 7.5 29.84 7.73 30.41 8.15 30.84 C 8.58 31.26 9.15 31.5 9.75 31.5 L 12.75 31.5 C 13.34 31.5 13.91 31.26 14.34 30.84 C 14.76 30.41 15 29.84 15 29.25 L 15 6.75 C 15 6.15 14.76 5.58 14.34 5.15 C 13.91 4.73 13.34 4.5 12.75 4.5 Z M 26.25 4.5 L 23.25 4.5 C 22.65 4.5 22.08 4.73 21.65 5.15 C 21.23 5.58 21 6.15 21 6.75 V 29.25 C 21 29.84 21.23 30.41 21.65 30.84 C 22.08 31.26 22.65 31.5 23.25 31.5 L 26.25 31.5 C 26.84 31.5 27.41 31.26 27.84 30.84 C 28.26 30.41 28.5 29.84 28.5 29.25 V 6.75 L 28.5 6.75 C 28.5 6.15 28.26 5.58 27.84 5.15 C 27.41 4.73 26.84 4.5 26.25 4.5 Z"></path>
                            </svg>
                        </button>
                        <button class="player__btn toggle-btn" id="sound-toggle">
                            <svg class="toggle__item toggle__item--inactive" width="30px" height="30px" fill="inherit" viewBox="0 -960 960 960">
                                <path d="M640-440v-80h160v80H640Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM120-360v-240h160l200-200v640L280-360H120Zm280-246-86 86H200v80h114l86 86v-252ZM300-480Z"/>
                            </svg>
                            <svg class="toggle__item toggle__item--active" width="30px" height="30px" fill="inherit" viewBox="0 -960 960 960">
                                <path d="m616-320-56-56 104-104-104-104 56-56 104 104 104-104 56 56-104 104 104 104-56 56-104-104-104 104Zm-496-40v-240h160l200-200v640L280-360H120Zm280-246-86 86H200v80h114l86 86v-252ZM300-480Z"/>
                            </svg>
                        </button>
                        <div class="player__timer" id="timer"></div>
                    </div>
                    <div class="control__right">
                        <button class="player__btn" id="full-toggle">
                            <svg width="30px" height="30px" fill="inherit" viewBox="0 -960 960 960">
                                <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h160v80H200Zm400 0v-80h160v-160h80v160q0 33-23.5 56.5T760-120H600ZM120-600v-160q0-33 23.5-56.5T200-840h160v80H200v160h-80Zm640 0v-160H600v-80h160q33 0 56.5 23.5T840-760v160h-80Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="video__body">
            <div class="video__title">
            </div>
            <div class="video__meta">
            </div>
        </div>
        
    </div>
    <div class="content__list f-column" id="preview__container">
    </div>
</main>

<?php
    require_once 'general/footer.php';
?>
