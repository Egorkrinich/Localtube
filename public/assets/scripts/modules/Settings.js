export default class Settings {
    constructor() {
        this.form = document?.querySelector('#settings')
        this.submitBtn = this.form?.querySelector('button[type="submit"]')

        if (!this.form) return
        this.initListeners()
    }
    initListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.checkValues()
            this.submitBtn.disabled = true
        })
        this.form.addEventListener('click', (e) => {
            const logoutBtn = e.target.closest('#logout')
            if (logoutBtn) {
                e.preventDefault()
                this.logout()
            }
        })
    }
    checkValues() {
        const settingsData = new FormData()
        const inputs = this.form.querySelectorAll('input:not([type="file"])')

        inputs.forEach((input) => {
            const isChanged = input.value !== input.defaultValue;

            if (isChanged && input.value !== "") {
                settingsData.append(input.name, input.value)
            }
        })
        const avatar = this.form?.querySelector('[name="avatar"]').files[0];
        if (avatar) {
            settingsData.append('avatar', avatar);
        }

        if ([...settingsData.keys()].length <= 0) {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    message: 'you have not changed anything',
                    success: false
                }
            }))
            return
        }
        this.sendData(settingsData)
    }
    sendData(settingsData) {
        fetch(`${BASE_URL}API/Users/update`, {
            method: 'POST',
            body: settingsData
        })
        .then((res) => res.json())
        .then((data) => {
            let errorsMessage = ""
            if (data.errors && data.errors.length > 0) {
                errorsMessage = 
                `<br><small>
                ${
                data.errors.map(({key, message}) => key + ": " + message).join(',')
                }
                </small>`
            }
            if (!data.fields || data.fields.length === 0) {
                window.dispatchEvent(new CustomEvent('toast', {
                    detail: {
                        message: errorsMessage,
                        success: false,
                    }
                }))
                return;
            }
            let success = data.success
            let warningMessage = ""

            if (success && data.errors.length > 0) {
                success = "warning"
                warningMessage = "but, " + errorsMessage
            }
            const fieldText = data.fields.length > 1 ? "fields " : "field "
            const verb = data.fields.length > 1 ? 'were' : 'was'
            const message = `${fieldText} ${data.fields.join(', ')} ${verb} updated ${warningMessage}`

            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    "success": success,
                    "message": message
                }
            }))
        })
        .finally(() => {
            this.submitBtn.disabled = false
        })
    }
    logout() {
        fetch(`${BASE_URL}API/Users/logout`)
        .then((res) => res.json())
        .then((data) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    message: data.message,
                    success: true,
                }
            }))
            setTimeout(() => window.location.reload(), 2000)
        })
    }
}