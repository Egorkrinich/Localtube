<form class="settings f-column modal-menu" data-menu="settings" id="settings">
    <div class="settings__header modal-menu__header">
        <h2 class="settings__title">
            Settings
        </h2>
    </div>

    <div class="settings__field f-column">
        <label for="username">username</label>
        <input class="input--primary" type="username" 
        name="username" minlength="3" maxlength="30">
    </div>

    <div class="settings__field f-column">
        <label for="avatar">Avatar</label>
        <input name="avatar" type="file" accept="image/*">
    </div>
    
    <div class="settings__field f-column">
        <label for="password">Password change</label>
        <input class="input--primary" type="password" 
        name="password" minlength="10" maxlength="40">
    </div>

    <div class="settings__actions f-row-around">
        <button class="settings__submit btn--primary" type="submit">Save</button>
        <button class="settings__logout" id="logout">Logout</button>
    </div>
</form>