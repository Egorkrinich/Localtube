<?php
    require_once 'general/header.php';
    require_once 'general/sidebar.php';
?>
<!-- id: create-playlist, data-menu: create-playlist -->
<form class="add-playlist playlist-menu modal-menu" id="create-playlist" data-menu="create-playlist">

    <div class="playlist-menu modal-menu__header">
        <h2 class="playlist-menu__title">
            Add new playlist
        </h2>
    </div>

    <div class="playlist-menu__body">
        <div class="playlist-menu__field f-column">
            <label for="title">Playlist name</label>
            <input class="input--primary" name="title" maxlength="100">
        </div>

        <div class="playlist-menu__field f-column">
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
        <button class="btn--primary">Add</button>
    </div>

</form>
<!-- id: edit-playlist, data-menu: edit -->
<form class="edit-playlist playlist-menu modal-menu" id="edit-playlist" data-menu="edit">

    <div class="playlist-menu__header modal-menu__header">
        <h2 class="playlist-menu__title">
            Edit playlist
        </h2>
    </div>

    <div class="playlist-menu__body f-row-around">

        <div class="playlist-menu__block">
            <div class="playlist-menu__field f-column">
                <label for="name">New playlist name</label>
                <input class="input--primary" name="title" maxlength="100">
            </div>
            <div class="playlist-menu__field f-column">
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
        </div>
        <div class="playlist-menu__block f-row">
            <button class="btn--primary" type="submit">
                Save
            </button>
            <button class="btn--secondary playlist-menu__delete-btn" data-edit-btn="deletePlaylist">
                <svg width="24px" height="24px" viewBox="0 -960 960 960">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>
        </div>
    </div>

    <div class="playlist-menu__list f-column"></div>
</form>

<main class="content playlists">  
    <div class="playlists__header f-row-between">
        <h1 class="playlists__title">
            Playlists
        </h1>
        <button class="btn--secondary" data-menu-btn="create-playlist">
            Add new
        </button>
    </div>
    <div class="playlists__body content--grid" id="preview-container"></div>
</main>

<?php
    require_once 'general/footer.php';
?>
