<?php
    require_once 'general/header.php';
    require_once 'general/sidebar.php';
?>
<div class="add-playlist modal-menu" data-menu="add-playlist">
    <div class="add-playlist__header">
        <h2 class="add-playlist__title">
            Add new playlist
        </h2>
    </div>
    <form class="add-playlist__body" id="playlist-form">
        <div class="add-playlist__field">
            <label for="name">Playlist name</label>
            <input class="input--primary" name="title" maxlength="100">
        </div>

        <div class="add-playlist__field">
            <label for="type">Playlist type</label>
            <select name="type" class="input--primary">
                <option value="private" selected>
                    Private
                </option>
                <option value="global">
                    global
                </option>
            </select>
        </div>
        <button class="btn--primary">Add</button>
    </form>
</div>

<main class="content playlists">  
    <div class="playlists__header">
        <h1 class="playlists__title">
            Playlists
        </h1>
        <button class="btn--secondary" data-menu-btn="add-playlist">
            Add new
        </button>
    </div>
    <div class="playlists__body">

    </div>
</main>

<?php
    require_once 'general/footer.php';
?>
