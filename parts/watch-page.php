<?php
    $dbVideo = new Video();
    $video_id = $_GET['v'];
    $video = $dbVideo->getVideo($video_id);

    // echo '<pre>';
    // print_r($video);
    // echo '</pre>';
    // exit;

    if (!$video) {
        header("Location: ". BASE_URL);
        exit;
    }

    // Video data
    $pageData = [];

    $pageData['name'] = 'VIDEO_DATA';
    $pageData['meta'] = $video;

    // Playlists
    $myPlaylists = false;

    if (isset($_SESSION['uid']) && !empty($_SESSION['uid'])) {
        $dbHistory = new History();
        $dbHistory->addHistory();

        $dbPlaylist = new Playlist();
        $myPlaylists = $dbPlaylist->getPlaylistsModal();
    }

    require_once 'general/header.php';
?>

<main class="watch content">
    <div class="watch__v-core v-core">

        <div class="player" id="player">
            
            <video src="<?= BASE_URL . $video['video']; ?>" class="player__video" 
            id="player-video" data-vreact="video"></video>
            
            <div class="control f-column-between active" id="player-control">

                <div class="control__header">
                    <h3 class="control__title" data-vreact="title">
                        <?= htmlspecialchars($video['title']); ?>
                    </h3>
                </div>

                <div class="control__body">
                    <div class="control__progress-bar">
                        <div class="control__progress-line"></div>
                    </div>

                    <div class="control__container f-row-between"> 

                        <div class="control__left f-row">
                            <button class="control__btn control__btn--toggle" 
                                data-player-action="toggle-play">
                                <svg class="control__toggle-item--inactive control__toggle-item" viewBox="0 0 36 36">
                                    <path d="M 17 8.6 L 10.89 4.99 C 9.39 4.11 7.5 5.19 7.5 6.93 C 7.5 6.93 7.5 6.93 7.5 6.93 L 7.5 29.06 C 7.5 30.8 9.39 31.88 10.89 31 C 10.89 31 10.89 31 10.89 31 L 17 27.4 C 17 27.4 17 27.4 17 27.4 C 17 27.4 17 27.4 17 27.4 L 17 8.6 C 17 8.6 17 8.6 17 8.6 C 17 8.6 17 8.6 17 8.6 Z M 17 8.6 L 17 8.6 C 17 8.6 17 8.6 17 8.6 C 17 8.6 17 8.6 17 8.6 V 27.4 C 17 27.4 17 27.4 17 27.4 C 17 27.4 17 27.4 17 27.4 L 33 18 C 33 18 33 18 33 18 C 33 18 33 18 33 18 V 18 L 17 8.6 C 17 8.6 17 8.6 17 8.6 C 17 8.6 17 8.6 17 8.6 Z"></path>
                                </svg>
                                <svg class="control__toggle-item--active control__toggle-item" viewBox="0 0 36 36">
                                    <path d="M 12.75 4.5 L 9.75 4.5 C 9.15 4.5 8.58 4.73 8.15 5.15 C 7.73 5.58 7.5 6.15 7.5 6.75 L 7.5 29.25 C 7.5 29.84 7.73 30.41 8.15 30.84 C 8.58 31.26 9.15 31.5 9.75 31.5 L 12.75 31.5 C 13.34 31.5 13.91 31.26 14.34 30.84 C 14.76 30.41 15 29.84 15 29.25 L 15 6.75 C 15 6.15 14.76 5.58 14.34 5.15 C 13.91 4.73 13.34 4.5 12.75 4.5 Z M 26.25 4.5 L 23.25 4.5 C 22.65 4.5 22.08 4.73 21.65 5.15 C 21.23 5.58 21 6.15 21 6.75 V 29.25 C 21 29.84 21.23 30.41 21.65 30.84 C 22.08 31.26 22.65 31.5 23.25 31.5 L 26.25 31.5 C 26.84 31.5 27.41 31.26 27.84 30.84 C 28.26 30.41 28.5 29.84 28.5 29.25 V 6.75 L 28.5 6.75 C 28.5 6.15 28.26 5.58 27.84 5.15 C 27.41 4.73 26.84 4.5 26.25 4.5 Z"></path>
                                </svg>
                            </button>
                            <button class="control__btn control__btn--toggle" 
                                data-player-action="toggle-sound">
                                <svg class="control__toggle-item--inactive control__toggle-item" viewBox="0 -960 960 960">
                                    <path d="M760-481q0-83-44-151.5T598-735q-15-7-22-21.5t-2-29.5q6-16 21.5-23t31.5 0q97 43 155 131.5T840-481q0 108-58 196.5T627-153q-16 7-31.5 0T574-176q-5-15 2-29.5t22-21.5q74-34 118-102.5T760-481ZM280-360H160q-17 0-28.5-11.5T120-400v-160q0-17 11.5-28.5T160-600h120l132-132q19-19 43.5-8.5T480-703v446q0 27-24.5 37.5T412-228L280-360Zm380-120q0 42-19 79.5T591-339q-10 6-20.5.5T560-356v-250q0-12 10.5-17.5t20.5.5q31 25 50 63t19 80ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/>
                                </svg>
                                <svg  class="control__toggle-item--active control__toggle-item" viewBox="0 -960 960 960">
                                    <path d="m720-424-76 76q-11 11-28 11t-28-11q-11-11-11-28t11-28l76-76-76-76q-11-11-11-28t11-28q11-11 28-11t28 11l76 76 76-76q11-11 28-11t28 11q11 11 11 28t-11 28l-76 76 76 76q11 11 11 28t-11 28q-11 11-28 11t-28-11l-76-76Zm-440 64H160q-17 0-28.5-11.5T120-400v-160q0-17 11.5-28.5T160-600h120l132-132q19-19 43.5-8.5T480-703v446q0 27-24.5 37.5T412-228L280-360Zm120-246-86 86H200v80h114l86 86v-252ZM300-480Z"/>
                                </svg>
                            </button>
                            <div class="control__timer f-row" id="timer"></div>
                        </div>

                        <div class="control__right f-row">
                            <button class="control__btn control__btn--advance" 
                                data-player-action="toggle-advance">
                            </button>
                            <button class="control__btn"
                                data-player-action="toggle-full">
                                <svg viewBox="0 -960 960 960">
                                    <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h160v80H200Zm400 0v-80h160v-160h80v160q0 33-23.5 56.5T760-120H600ZM120-600v-160q0-33 23.5-56.5T200-840h160v80H200v160h-80Zm640 0v-160H600v-80h160q33 0 56.5 23.5T840-760v160h-80Z"/>
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="rewind f-row-between" id="player-rewind">
                <div class="rewind-left f-row-center" 
                data-player-rewind="left">
                    - 5s 
                    <svg class="rewind-svg" height="24px" viewBox="0 -960 960 960">
                        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
                    </svg>
                </div>
                <div class="rewind-right f-row-center"
                data-player-rewind="right">
                    + 5s  
                    <svg class="rewind-svg" height="24px" viewBox="0 -960 960 960">
                        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
                    </svg>
                </div>
            </div>

            <div class="advance f-row-center" id="player-advance"></div>
            
        </div>

        <div class="v-core__details" id="video-body">

            <div class="v-core__meta">
                <h1 class="v-core__title" data-vreact="title">
                    <?php echo htmlspecialchars($video['title']); ?>
                </h1>
                <div class="v-core__subheader f-row-between">
                    <a href="<?php echo BASE_URL . $video['uploader_login']; ?>"
                        class="v-core__uploader f-row" data-vreact="uploader_login">
                        <div class="v-core__uploader--avatar avatar">
                            <img src="<?php echo BASE_URL . $video['uploader_avatar']; ?>"
                            alt="<?php echo htmlspecialchars($video['uploader_name'])?>'s avatar" 
                            data-vreact="uploader_avatar">
                        </div>
                        <div class="v-core__uploader--name" data-vreact="uploader_name">
                            <?php echo htmlspecialchars($video['uploader_name']); ?>
                        </div>
                    </a>

                    <div class="v-core__actions f-row">

                        <button class="v-core__action btn--secondary f-row-center" 
                            data-vd-action="like">
                            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
                            </svg>
                            <span data-vreact="likes">
                                <?= $video['likes']; ?>
                            </span>
                        </button>

                        <button class="v-core__action btn--secondary f-row-center" 
                            data-vd-action="dislike">
                            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                                <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
                            </svg>
                            <span data-vreact="dislikes">
                                <?= $video['dislikes']; ?>
                            </span>
                        </button>

                        <button class="v-core__action btn--secondary"
                            data-vd-action="share">
                            Share
                        </button>

                        <button class="v-core__action btn--secondary"
                            data-menu-btn="pl-save" data-no-overlay>
                            Add to playlist
                        </button>

                        
                        <ul class="v-core__pl-save" data-menu="pl-save">
                            <?php
                            if ($myPlaylists) :
                                foreach ($myPlaylists as $singlePlaylist) : 
                            ?>
                            <li>
                                <button data-vd-action="addToPlaylist"
                                    data-vd-playlist="<?= $singlePlaylist['id']; ?>">
                                    <?= $singlePlaylist['title']; ?>
                                </button>
                            </li>
                            <?php endforeach; endif; ?>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

    </div>

    <div class="watch__flow flow" id="general-container">
        <!-- v-feed, pl-view  -->
        
        <div class="watch__v-feed f-column" id="video-feed-container"></div>
    </div>
</main>

<?php
    require_once 'general/footer.php';
?>
