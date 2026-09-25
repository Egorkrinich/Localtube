<?php
    require_once 'general/header.php';
    require_once 'general/sidebar.php';
?>
<form class="pl-create modal f-column" id="create-playlist" data-menu="playlist-create">

    <div class="pl-create__header modal__header f-row">
        <button class="modal__close" data-menu-btn="playlist-create" type="button">
            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
            </svg>
        </button>
        <h2 class="pl-create__title">
            Create new playlist
        </h2>
    </div>

    <div class="pl-create__body modal__body f-column-center">

        <div class="pl-create__field">
            <label for="title">Playlist title</label>
            <input name="title" class="input--primary" maxlength="100">
        </div>

        <div class="pl-create__field">
            <label for="type">Playlist type</label>
            <select name="type" class="input--primary">
                <option value="private" selected>
                    private
                </option>
                <option value="public">
                    public
                </option>
            </select>
        </div>

        <button class="pl-create__submit btn--primary">Create</button>
    </div>

</form>

<form class="pl-edit modal f-column" id="edit-playlist" data-menu="edit">

    <div class="pl-edit__header modal__header f-row">
        <button class="modal__close" data-menu-btn="edit" type="button">
            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
            </svg>
        </button>
        <h2 class="pl-edit__title">
            Edit playlist
        </h2>
    </div>

    <div class="pl-edit__body modal__body f-row-between">

        <div class="pl-edit__group">
            <div class="pl-edit__field f-column">
                <label for="title">Playlist title</label>
                <input name="title" class="input--primary" maxlength="100">
            </div>
            <div class="pl-edit__field f-column">
                <label for="type">Playlist type</label>
                <select name="type" class="pl-edit__select input--primary">
                    <option value="private" selected>
                        private
                    </option>
                    <option value="public">
                        public
                    </option>
                </select>
            </div>
        </div>

        <div class="pl-edit__actions f-row-center">
            <button class="pl-edit__submit btn--primary" type="submit">
                Save
            </button>
            <button class="pl-edit__delete btn--secondary"
                data-pl-edit-btn="deletePlaylist">
                <svg width="24px" height="24px" viewBox="0 -960 960 960">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>
        </div>

    </div>

    <div class="pl-edit__list f-column" data-pl-edit="list"></div>
</form>

<main class="playlists headered">  
    <div class="playlists__header f-row-between">
        <h1 class="playlists__title">
            Playlists
        </h1>
        <button class="btn--secondary" data-menu-btn="playlist-create">
            Create new
        </button>
    </div>
    <div class="playlists__body content--grid" id="video-feed-container"></div>
</main>

<?php
    require_once 'general/footer.php';
?>
