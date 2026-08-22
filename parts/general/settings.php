<form class="settings f-column" data-menu="settings" id="settings">
    <div class="settings__header">
        <h2 class="settings__title">
            Settings
        </h2>
    </div>
    <div class="settings__field f-column">
        <label for="password">Password change</label>
        <input class="input--primary" type="password" 
        name="password" minlength="10" maxlength="30">
    </div>

    <div class="settings__actions f-row-around">
        <button class="settings__submit btn--primary" type="submit">Save</button>
        <button class="settings__logout" id="logout">Logout</button>
    </div>
</form>