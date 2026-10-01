export default class Theme {
    themes = ['dark', 'light']
    constructor() {
        this.docAttr = "data-theme"
        this.btnAttr = "data-theme-btn"

        this.isDarkTheme = "dark"

        this.setInitialTheme()
        this.initListeners()
    }
    initListeners() {
        document.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return
            const btn = e.target.closest(`[${this.btnAttr}]`)
            if (!btn) return

            const attr = btn.getAttribute(`${this.btnAttr}`)

            this.setTheme(attr)
        })
    }
    setTheme(theme) {
        if (!this.themes.includes(theme)) return

        const oldTheme = this.getCurrentTheme
        const oldBtn = this.getButton(oldTheme)
        oldBtn?.classList?.remove('active')

        localStorage.setItem('theme', theme)
        document.documentElement.setAttribute(this.docAttr, theme)

        const btn = this.getButton(theme)
        btn?.classList.add('active')
    }
    setInitialTheme() {
        const theme = this.getCurrentTheme
        document.documentElement.setAttribute(this.docAttr, theme)

        const btn = this.getButton(theme)
        btn?.classList.add('active')
    }
    get getCurrentTheme() {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) return savedTheme;

        const isSystemDark = window.matchMedia
        ('(prefers-color-scheme: dark)').matches;

        return isSystemDark ? 'dark' : 'light';
    }
    getButton(value) {
        return document?.querySelector(`[${this.btnAttr}="${value}"]`)
    }
}