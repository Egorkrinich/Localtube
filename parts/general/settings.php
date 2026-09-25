<form class="settings modal f-column" data-menu="settings" id="settings">

    <div class="settings__header modal__header f-row">
        <button class="modal__close" data-menu-btn="settings" type="button">
            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
            </svg>
        </button>
        <h2 class="settings__title"> 
            Settings 
        </h2>
    </div>

    <div class="settings__body modal__body">
        <div class="settings__field f-column">
            <label for="username">New username</label>
            <input name="username" class="input--primary"
            minlength="3" maxlength="30">
        </div>
        <div class="settings__field f-column">
            <label for="avatar">Avatar</label>
            <input name="avatar" type="file" accept="image/*">
        </div>
        <div class="settings__field f-column">
            <label for="password">New password</label>
            <input name="password" class="input--primary"
            type="password" minlength="10" maxlength="40">
        </div>
    </div>

    <div class="settings__footer modal__footer f-row-around">
        <button class="settings__submit btn--primary" type="submit">
            Save
        </button>
        <button class="settings__logout">
            Logout
        </button>
    </div>
    
</form>