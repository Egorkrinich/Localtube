<div class="auth modal-menu" data-auth-form="sign-up" data-menu="auth">

    <form class="auth__sign-up auth__form f-column-center" id="auth-signUp" novalidate>
        <h3 class="auth__title">
            Register
        </h3>

        <div class="auth__field f-column">
            <label for="username">Username</label>
            <input class="input--primary" type="text" 
            name="username" minlength="3" maxlength="30" 
            aria-errormessage="username-error" 
            required data-form-input>
    
            <div class="auth__field-error" id="username-error" 
            data-form-errors-field></div>
        </div>

        <div class="auth__field f-column">
            <label for="login">Login</label>
            <input class="input--primary"type="text" 
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

        <div class="auth__field f-column">
            <label for="passConfirm">Confirm Password</label>
            <input class="input--primary" type="password" 
            name="passConfirm" minlength="10" maxlength="40" 
            aria-errormessage="passConfirm-error" 
            required data-form-input>
    
            <div class="auth__field-error" id="passConfirm-error" 
            data-form-errors-field></div>
        </div>
        <!-- ... -->
    
        <button type="submit" class="auth__submit btn--primary">
            Register
        </button>
        <button class="auth__switch" data-auth-switch type="button">
            Already have an account?
        </button>
    </form>

    <form class="auth__sign-in auth__form f-column-center" id="auth-signIn" novalidate>
        <h3 class="auth__title">
            Login
        </h3>
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
    
        <button type="submit" class="auth__submit btn--primary">
            Login
        </button>
        <button class="auth__switch" data-auth-switch type="button">
            Have not an account?
        </button>
    </form>
    
</div>