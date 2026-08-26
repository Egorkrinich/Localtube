import { Templates } from "../Templates.js"

export default class Context {
    attributes = {
        btn: 'data-context-btn',
        videoId: 'data-context-id'
    }
    content = {
        global: [
            { body: "Share", class: 'share' },
        ],
        personal: [
            { body: "Share", class: 'share' },
            { body: "Delete", class: "delete"},
        ]
    }
    constructor(path) {
        this.menu = document.querySelector('#context-menu')
        this.contentType = path.endsWith('manager') ? 'personal' : 'global'

        this.menuWidth = null
        this.menuHeight = null

        this.videoId = null

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
                this.videoId = btn.getAttribute(this.attributes.videoId)
                this.MenuPosition(btn)
                return;
            }
            if ((!btn && !target.closest('#context-menu'))) {
                this.closeMenu()
            }
        })
        this.menu.addEventListener('click', (e) => {
            if (!this.videoId) return
            const target = e.target
            if (target.closest('.context__delete')) {
                if (confirm('Are you sure?')) {
                    this.deleteVideo(this.videoId);
                }
            }
            if (target.closest('.context__share')) {
                this.copyVideo()
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
        this.videoId = null
    }
    
    renderMenu() {
        const content = Templates.contextMenu(this.content[this.contentType])
        this.menu.innerHTML = content
    }
    getMenuSize() {
        const size = this.menu.getBoundingClientRect()
        this.menuWidth = Math.ceil(size.width)
        this.menuHeight = Math.ceil(size.height)
    }

    copyVideo() {
        navigator.clipboard.writeText(BASE_URL + 'watch?v=' + this.videoId);
        window.dispatchEvent(new CustomEvent('toast', {
            detail: {
                message: 'Copied!',
                success: true
            }
        }))
    }
    deleteVideo(id) {
        const data = new FormData()
        data.append('id', id)

        fetch(`${BASE_URL}API/Videos/delVideo`, {
            method: 'POST',
            body: data
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
}