export default class Toast {
    constructor() {
        this.container = document.querySelector('#toast')

        this.initListener()
    }
    initListener() {
        window.addEventListener('toast', (e) => {
            const {message, success} = e.detail;

            this.activeToast(message, success)
        })
    }
    activeToast(message, success) {
        const color = success ? '#00ff0d' : '#ff0000'

        this.container.innerHTML = message
        this.container.classList.add('active')
        this.container.style.borderColor = color

        setTimeout(() => {
            this.closeToast()
        }, 3000)
    }
    closeToast() {
        this.container.innerHTML = ''
        this.container.classList.remove('active')
        this.container.style.borderColor = 'transparent'
    }
}