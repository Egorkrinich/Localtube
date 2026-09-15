export default class Stage {
    selectors = {
        menu: 'data-page-menu',
        button: 'data-page-menu-btn',
    }
    constructor() {
        this.container = document.querySelector(`[data-page]`)
        this.default = this.container
        .querySelector(`[${this.selectors.menu}="default"]`)

        
        this.activeMenu = null
        this.initListeners();
        this.default.classList.add('active')
    }
    initListeners() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest(`[${this.selectors.button}]`)
            
            if (btn && this.activeMenu) {                
                this.closeAll()
                return
            }
            if (btn) {
                const dataValue = btn.getAttribute(`${this.selectors.button}`)
                const menu = this.container
                .querySelector(`[${this.selectors.menu}="${dataValue}"]`)

                this.classManager(menu)
                return;
            }
        })
    }
    classManager(menu) {
        if (this.activeMenu === menu) {
            this.closeAll()
        } else {
            menu.classList.add('active')
            this.activeMenu = menu
            this.default.classList.remove('active')
        }        
    }
    closeAll() {
        this.activeMenu?.classList.remove('active')
        this.activeMenu = null
        this.default.classList.add('active')
    }
}