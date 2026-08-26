export default class Toast {
    colors = {
        true: '#00ff0d',
        false: '#ff0000',
        warning: '#ffbb00',
    }
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
        this.container.innerHTML = message
        this.container.classList.add('active')
        this.container.style.borderColor = this.colors[success]

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