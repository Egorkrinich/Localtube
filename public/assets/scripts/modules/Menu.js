export default class Menu {
    selectors = {
        menu: 'data-menu',
        button: 'data-menu-btn',
        noOverlay: 'data-no-overlay'
    }
    constructor() {
        this.overlay = document.querySelector('#overlay')

        this.activeMenu = null

        this.initListeners();
    }
    initListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target
            const btn = target.closest(`[${this.selectors.button}]`)

            if (btn) {
                const dataValue = btn.getAttribute(`${this.selectors.button}`)
                const menu = document.querySelector(`[${this.selectors.menu}="${dataValue}"]`)
                const noOverlay = btn.hasAttribute(`${this.selectors.noOverlay}`)

                this.classManager(menu, noOverlay)
                return;
            }
            if ((btn || !target.closest(`[${this.selectors.menu}]`)) && 
                this.activeMenu) {
                this.closeAll()
            }
        })
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.activeMenu) {
                this.closeAll()
            }
        })
    }
    classManager(menu, noOverlay) {
        if (this.activeMenu === menu) {
            this.closeAll()
        } else {
            menu.classList.add('active')
            this.closeAll()
            if (!noOverlay) {
                this.overlay.classList.add('active')
            }
            this.activeMenu = menu
        }        
    }
    closeAll() {
        this.activeMenu?.classList.remove('active')
        this.activeMenu = null
        this.overlay?.classList.remove('active')
    }
}