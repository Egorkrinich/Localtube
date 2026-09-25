<div class="auth modal" data-auth-form="sign-up" data-menu="auth">

    <form class="auth__sign-up auth__form f-column-center" id="auth-signUp" novalidate>
        <div class="auth__header modal__header f-row-center">
            <button class="auth__close modal__close" data-menu-btn="auth" type="button">
                <svg width="24px" height="24px" viewBox="0 -960 960 960">
                    <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
                </svg>
            </button>
            <h3 class="auth__title">
                Registration
            </h3>
        </div>

        <div class="auth__body modal__body">
            <div class="auth__field">
                <label for="username">Username</label>
                <input name="username" class="input--primary" 
                type="text" minlength="3" maxlength="30" 
                aria-errormessage="username-error" 
                required data-form-input>
    
                <div class="auth__field-error" id="username-error" 
                data-form-errors-field></div>
            </div>

            <div class="auth__field">
                <label for="login">Login</label>
                <input name="login" class="input--primary" 
                type="text" minlength="3" maxlength="30" 
                aria-errormessage="login-error" 
                required data-form-input>

                <div class="auth__field-error" id="login-error" 
                data-form-errors-field></div>
            </div>
    
            <div class="auth__field">
                <label for="password">Password</label>
                <input name="password" class="input--primary" 
                type="password" minlength="10" maxlength="40"
                aria-errormessage="password-error" 
                required data-form-input>

                <div class="auth__field-error" id="password-error" 
                data-form-errors-field></div>
            </div>

            <div class="auth__field">
                <label for="passConfirm">Confirm Password</label>
                <input name="passConfirm" class="input--primary" 
                type="password" minlength="10" maxlength="40" 
                aria-errormessage="passConfirm-error" 
                required data-form-input>

                <div class="auth__field-error" id="passConfirm-error" 
                data-form-errors-field></div>
            </div>
            
            <!-- ... -->

            <div class="auth__actions f-column-center">
                <button type="submit" class="auth__submit btn--primary">
                    Register
                </button>
                <button class="auth__switch" data-auth-switch type="button">
                    Already have an account?
                </button>
            </div>
        </div>
    </form>

    <form class="auth__sign-in auth__form f-column-center" id="auth-signIn" novalidate>
        <div class="auth__header modal__header f-row-center">
            <button class="auth__close modal__close" data-menu-btn="auth" type="button">
                <svg width="24px" height="24px" viewBox="0 -960 960 960">
                    <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
                </svg>
            </button>
            <h3 class="auth__title">
                Login
            </h3>
        </div>

        <div class="auth__body modal__body">
            <div class="auth__field f-column">
            <label for="login">Login</label>
            <input class="input--primary" type="text" 
            name="login" minlength="3" maxlength="30" 
            aria-errormessage="login-error" 
            required data-form-input>
    
            <div class="auth__field-error" id="login-error" 
            data-form-errors-field></div>
            </div>

            <div class="auth__field f-column">
            <label for="password">Password</label>
            <input class="input--primary" type="password" 
            name="password" minlength="10" maxlength="40"
            aria-errormessage="password-error" 
            required data-form-input>
    
            <div class="auth__field-error" id="password-error" 
            data-form-errors-field></div>
            </div>

            <div class="auth__actions f-column-center">
                <button type="submit" class="auth__submit btn--primary">
                    Login
                </button>
                <button class="auth__switch" data-auth-switch type="button">
                    Have not an account?
                </button>
            </div>
        </div>
    </form>
    
</div>