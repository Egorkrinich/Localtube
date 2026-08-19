export class Auth {
    errorMessageVariation = {
        valueMissing: ({name}) => 'This field is required',
        patternMismatch: ({title}) => title || 'Please enter a valid value.',
        tooShort: ({minLength}) => `The value must be at least ${minLength} characters long`,
        tooLong: ({maxLength}) => `The value cannot exceed ${maxLength} characters`,
        customError: () => 'Passwords do not match'
    }
    constructor() {
        this.container = document.querySelector('.auth')
        this.form = null

        this.initListeners() 
    }
    manageErrors(fieldInputElement, errorMessages) {
        const errorsFieldElement = 
        fieldInputElement.parentElement.querySelector('[data-form-errors-field]')

        errorsFieldElement.innerHTML = errorMessages
        .map((message) => `<span class="error-field">${message}</span>`)
        .join('')
    }
    validateField(fieldInputElement) {
        const errors = fieldInputElement.validity
        
        const errorMessages = []

        if (fieldInputElement.name === 'passConfirm') {            
            if (this.form.password.value ===
                fieldInputElement.value) {
                    fieldInputElement.setCustomValidity('')
                } else {
                    fieldInputElement.setCustomValidity('Passwords do not match')
                }
        }
        Object.entries(this.errorMessageVariation)
        .forEach(([errorType, getErrorMessage]) => {
            if (errors[errorType]) {
                errorMessages.push(getErrorMessage(fieldInputElement))
            }
        })
        
        this.manageErrors(fieldInputElement, errorMessages)
        const isValid = errorMessages.length === 0

        fieldInputElement.setAttribute('aria-invalid', !isValid)
        
        fieldInputElement.classList.toggle('invalid', !isValid)
        
        return isValid
    }

    initListeners() {
        this.container.addEventListener('click', (e) => {
            const switchBtn = e.target.closest('.auth__switch')
            if (switchBtn) {
                const newType =
                (this.container.getAttribute('data-form-type') === 'reg') ?
                'log' : 'reg' 
                this.container.setAttribute('data-form-type', newType)
            }
        })

        this.container.addEventListener('submit', (e) => {
            e.preventDefault()
            const action = e.target.id === 'auth-reg' ? 'register' : 'login'

            this.updateActiveForm(e.target)
            
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
        } else {
            this.sendData(action)
        }
    }
    sendData(action) {
        const formData = new FormData(this.form)

        const link = action === "register" ? 'register' : 'login'

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
    }
    updateActiveForm(currentForm) {
        if (!this.form || this.form !== currentForm) {
            this.form = currentForm
        }
    }
}