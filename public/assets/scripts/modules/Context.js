import { Templates } from "../Templates.js"

export default class Context {
    types = {
        global: [
            `
            <button class="context__button context__share">
                    Share
            </button>
            `
        ],
        manager: [
            `
            <button class="context__button context__share">
                Share
            </button>
            `,
            `
            <button class="context__button context__delete">
                Delete
            </button>
            `
        ],
        playlists: [
            `
                <button class="context__button context__share">
                    Share
                </button>
            `,
            `
                <button class="context__button context__edit" data-menu-btn="edit">
                    Edit
                </button>
            `
        ]
    }
    attributes = {
        btn: 'data-context-btn',
        videoId: 'data-context-id'
    }
    

    constructor(type) {
        this.contentType = this.types[type]
        this.menu = document.querySelector('#context-menu')

        this.menuWidth = null
        this.menuHeight = null

        this.id = null

        this.isActive = false
        
        this.renderMenu()
        this.getMenuSize()
        this.initListeners()
    }
    initListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target
            const btn = target.closest(`[${this.attributes.btn}]`)
            if (btn) {
                e.stopPropagation()
                e.preventDefault()

                this.id = btn.getAttribute(this.attributes.videoId)
                this.MenuPosition(btn)
                return;
            }
            if ((!btn && !target.closest('#context-menu'))) {
                this.closeMenu()
            }
        })
        this.menu.addEventListener('click', (e) => {
            if (!this.id) return
            const target = e.target
            if (target.closest('.context__delete')) {
                window.dispatchEvent(new CustomEvent('video:delete', {
                    detail: {
                        id: this.id
                    }
                }))
            }
            if (target.closest('.context__share')) {
                this.copyLink()
            }
            if (target.closest('.context__edit')) {
                window.dispatchEvent(new CustomEvent('edit', {
                    detail: {
                        id: this.id
                    }
                }))
                this.closeMenu()
            }
    });
    }
    MenuPosition(btn) {
        const rect = btn.getBoundingClientRect();
        
        let top = rect.bottom  + 5
        let left = rect.left

        if (left + this.menuWidth > window.innerWidth) {
            left = rect.right - this.menuWidth;
        }
        if (rect.bottom + this.menuHeight > window.innerHeight) {
            top = rect.top - this.menuHeight;
        }

        this.menu.style.top = `${top}px`;
        this.menu.style.left = `${left}px`;
        this.openMenu()
    }

    openMenu() {
        this.menu.classList.add('active')
        this.isActive = true
    }
    closeMenu() {
        this.menu.classList.remove('active')
        this.isActive = false
        this.id = null
    }
    
    copyLink() {
        navigator.clipboard.writeText(BASE_URL + 'watch?v=' + this.id);
        window.dispatchEvent(new CustomEvent('toast', {
            detail: {
                message: 'Copied!',
                success: true
            }
        }))
    }


    renderMenu() {
        const content = Templates.contextMenu(this.contentType) 
        || Templates.contextMenu(this.types.global)
        this.menu.innerHTML = content
    }
    getMenuSize() {
        const size = this.menu.getBoundingClientRect()
        this.menuWidth = Math.ceil(size.width)
        this.menuHeight = Math.ceil(size.height)
    }
}