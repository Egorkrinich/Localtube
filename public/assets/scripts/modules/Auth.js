export class Auth {
    attrs = {
        switch: "data-auth-switch",
        formType: "data-auth-form"
    }
    errorMessageVariation = {
        valueMissing: () => 'This field is required',
        patternMismatch: ({title}) => title || 'Please enter a valid value.',
        tooShort: ({minLength}) => `The value must be at least ${minLength} characters long`,
        tooLong: ({maxLength}) => `The value cannot exceed ${maxLength} characters`,
        customError: () => 'Passwords do not match'
    }
    constructor() {
        this.container = document.querySelector('.auth')
        this.form = null

        this.submitBtn = null

        this.initListeners() 
    }
    
    initListeners() {
        this.container.addEventListener('click', (e) => {
            const switchBtn = e.target.closest(`[${this.attrs.switch}]`)
            if (switchBtn) {
                const newType = 
                this.container.getAttribute(`${this.attrs.formType}`) === 'sign-up'
                ? 'sign-in' : 'sign-up' 
                this.container.setAttribute(`${this.attrs.formType}`, newType)
            }
        })

        this.container.addEventListener('submit', (e) => {
            e.preventDefault()
            this.updateActiveForm(e.target)

            const action = e.target.id === 'auth-signUp' ? 'sign-up' : 'sign-in'

            this.submitBtn = this.form.querySelector('button[type="submit"]')
            this.submitBtn.disabled = true

            this.onSubmit(action)
        })
        this.container.addEventListener('change', (e) => {
            if (e.target.required) {
                this.updateActiveForm(e.target.closest('.auth__form'))

                this.validateField(e.target)
            }
        })
        this.container.addEventListener('blur', (e) => {
            if (e.target.required) {
                this.updateActiveForm(e.target.closest('.auth__form'))
                this.validateField(e.target)
            }
        })
    }
    updateActiveForm(currentForm) {
        if (!this.form || this.form !== currentForm) {
            this.form = currentForm
        }
    }

    validateField(field) {
        if (this.form.id === "auth-signUp" && 
        (field.name === "password" || field.name === "passConfirm")) {
            const fieldPair = field.name === "password" ? 
            this.form.passConfirm : this.form.password
            const fieldConfirm = field.name === "password" ? fieldPair : field
            if (field.value === fieldPair.value) {
                fieldConfirm.setCustomValidity('')
            } else {
                fieldConfirm.setCustomValidity('Passwords do not match')
            }
            this.manageErrors(fieldConfirm, fieldConfirm.validity)
        }
        const errors = field.validity

        const errorMessages = this.manageErrors(field, errors)

        const isValid = errorMessages.length === 0

        field.setAttribute('aria-invalid', !isValid)
        field.classList.toggle('invalid', !isValid)
        
        return isValid
    }
    manageErrors(field, errors) {
        const errorMessages = []
        Object.entries(this.errorMessageVariation)
        .forEach(([errorType, getErrorMessage]) => {
            if (errors[errorType]) {
                errorMessages.push(getErrorMessage(field))
            }
        })

        
        this.renderErrors(field, errorMessages)
        return errorMessages
    }
    renderErrors(field, errorMessages) {
        const errorsFieldElement = 
        field.parentElement.querySelector('[data-form-errors-field]')

        errorsFieldElement.innerHTML = errorMessages
        .map((message) => `<span class="error-field">${message}</span>`)
        .join('')
    }

    onSubmit(action) {  
        const requiredInputElements = [...this.form.elements]
        .filter(({required}) => required)
        
        let isFormValid = true
        let firstInvalidFieldInput = null

        requiredInputElements.forEach((element) => {
            const isFieldValid = this.validateField(element)

            if (!isFieldValid) {
                isFormValid = false

                if (!firstInvalidFieldInput) {
                    firstInvalidFieldInput = element
                }
            }
        })

        if (!isFormValid) {
            firstInvalidFieldInput.focus()
            this.submitBtn.disabled = false
        } else {
            this.sendData(action)
        }
    }
    sendData(action) {
        const formData = new FormData(this.form)

        const link = action === "sign-up" ? 'register' : 'login'

        fetch(`${BASE_URL}API/Users/${link}`, {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    message: data.message,
                    success: data.success
                }
            }))
            if (data.success) {
                setTimeout(() => location.reload(), 2000)
            }
        })
        .finally(() => {
            this.submitBtn.disabled = false
            this.submitBtn = null  
        })
    }
}