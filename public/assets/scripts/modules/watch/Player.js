import { formatTime, ops } from "../helper.js"

export class Player {
    attr = {
        action: 'data-player-action'
    }
    actions = {
        play:    'toggle-play',
        sound:   'toggle-sound',
        full:    'toggle-full',
        advance: 'toggle-advance'
    }
    actionBtns = {
        play:    document.querySelector(`[${this.attr.action}="${this.actions.play}"]`),
        sound:   document.querySelector(`[${this.attr.action}="${this.actions.sound}"]`),
        full:    document.querySelector(`[${this.attr.action}="${this.actions.full}}"]`),
        advance: document.querySelector(`[${this.attr.action}="${this.actions.advance}"]`)
    }

    constructor() {
        // -- Elements --
        this.player  = document.querySelector('#player')
        this.video   = this.player.querySelector('#player-video')
        this.control = this.player.querySelector('#player-control')
        this.rewind  = this.player.querySelector('#player-rewind')

        this.progressBar = this.control.querySelector('.control__progress-bar')
        this.progressLine = this.progressBar.querySelector('.control__progress-line')
        this.timer = this.control.querySelector('.control__timer')

        // -- State & Flags
        this.isPaused = true
        this.isControlShowed = true
        
        this.duration = VIDEO_DATA.duration || 0
        
        this.controlDuration = USER_CONFIG.isMobile ? 5000 : 2000
        
        // Temporary states
        this.controlHideTimeout = null
        this.resumeTimeTimeout = null
        this.lastTapTime = null

        // details
        this.settings = {};

        
        
        this.getSettings()
        this.initListeners()
        this.updateProgress()
        if (!USER_CONFIG.isMobile) { this.initHotkeys() }
    }
    initListeners() {
        window.addEventListener('video:toggled', () => {
            setTimeout(() => {
                this.duration = VIDEO_DATA.duration
                this.video.currentTime = 0
                this.updateProgress()
                this.togglePlay()
            }, 0)
        })
        // Global Listeners
        this.video.addEventListener('timeupdate', () => this.updateProgress())
        this.video.addEventListener('ended', () => { 
            this.actionBtns.play.classList.remove('active')
            this.isPaused = true
            if (this.settings.advance) {
                window.dispatchEvent(new CustomEvent('video:ended'))
            }
        })

        this.control.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            const btn = e.target.closest(`[${this.attr.action}]`)
            if (!btn) {
                if (!this.isControlShowed && USER_CONFIG.isMobile) {
                    this.showControl()
                    return
                }

                if (!e.target.closest('.control__header') && 
                    !e.target.closest('.control__body')) {
                    this.togglePlay()
                }
                return
            }
            const attrValue = btn.getAttribute(`${this.attr.action}`)

            switch (attrValue) {
                case this.actions.play: 
                    this.togglePlay()
                break;
                case this.actions.sound:
                    this.updatePlayerSetting('muted')
                    this.toggleSound()
                break;
                case this.actions.full:
                    this.toggleFull()
                break;
                case this.actions.advance:
                    this.updatePlayerSetting('advance')
                    this.toggleAdvance()
                break;
            }
        })

        // Mobile
        if (USER_CONFIG.isMobile) {
            this.control.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) return;
                
                const currentTime = performance.now();
                const tapDelay = currentTime - this.lastTapTime;

                if (tapDelay < 300 && tapDelay > 0) {
                    const touchX = e.touches[0].clientX
                    const videoWidth = this.player.clientWidth;

                    if (touchX < videoWidth / 2) {
                        this.skipTime('-')
                    } else {
                        this.skipTime('+')
                    }
                    this.togglePlay(true)
                }
                this.lastTapTime = currentTime;
            });
        }
        // PC
        if (!USER_CONFIG.isMobile) {
            this.control.addEventListener('mousemove', () => {
                if (this.isPaused) return;
                this.showControl()
            })
            this.progressBar.addEventListener('pointerdown', (e) => {
                this.scrub(e)
                const onMouseMove = (e) => this.scrub(e)

                window.addEventListener('pointermove', onMouseMove)

                window.addEventListener('pointerup', () => {
                    window.removeEventListener('pointermove', onMouseMove)
                }, {once: true})
            })
        }
    }
    initHotkeys() {
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            switch(e.code) {
                case 'Space':
                    e.preventDefault()
                    this.togglePlay()
                break;
                case 'KeyM':
                    this.toggleSound()
                    this.updatePlayerSetting('muted')
                break;
                case 'KeyF':
                    this.toggleFull()
                break;
                case 'ArrowLeft':
                    this.skipTime('-')
                break;
                case 'ArrowRight':
                    this.skipTime('+')
                break;
            }
        })
    }
    
    togglePlay(dblclick = false) {
        if (this.video.paused || dblclick) {
            this.isPaused = false
            this.video.play()
            this.actionBtns.play.classList.add('active')
            if (dblclick) {
                this.control.classList.add('hide-instantly')
                setTimeout(() => { this.showControl(false) }, 100)
                setTimeout(() => { 
                    this.control.classList.remove('hide-instantly')
                }, 500)
                return
            }

            this.showControl()
        } else {
            this.isPaused = true
            this.video.pause()
            this.actionBtns.play.classList.remove('active')
            this.showControl(true)
        }
    }
    toggleSound() {
        if (this.video.muted) {
            this.video.muted = false
            this.actionBtns.sound.classList.remove('active')
        } else {
            this.video.muted = true
            this.actionBtns.sound.classList.add('active')
        }
    }
    toggleFull() {
        if (!document.fullscreenElement) {
            if (this.player.requestFullscreen) {
                this.player.requestFullscreen();
            } else if (this.player.webkitRequestFullscreen) {
                this.player.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    toggleAdvance() {
        this.actionBtns.advance.classList
        .toggle('active', this.settings['advance'])
    }

    showControl(forceVisibility = null) {
        if (this.controlHideTimeout) clearTimeout(this.controlHideTimeout)

        if (forceVisibility !== null) {
            this.control.classList.toggle('active', forceVisibility)
            this.isControlShowed = forceVisibility
            return  
        }
        
        this.control.classList.add('active')
        this.isControlShowed = true
        
        this.controlHideTimeout = setTimeout(() => { 
            if (this.isPaused) return

            this.control.classList.remove('active')
            this.isControlShowed = false
        }, this.controlDuration)
    }

    scrub(e) {
        const scrubTime = (e.offsetX / this.progressBar.offsetWidth) * this.duration;
        this.video.currentTime = scrubTime;
    }
    skipTime(action) {
        const rewindClass = action === "+" ? 'active--right' : 'active--left'
        this.video.currentTime = ops[action](this.video.currentTime, 5)

        this.rewind.classList.add(rewindClass)
        setTimeout(() => {this.rewind.classList.remove(rewindClass)}, 500)
    }

    getSettings() {
        const playerResume = JSON.parse(localStorage.getItem('player_resume_state'))
        if (playerResume && playerResume.id === VIDEO_DATA.id) {
            this.video.currentTime = playerResume.seconds
        }

        const settings = JSON.parse(localStorage.getItem('player_settings'))
        if (!settings) {
            const defaultSettings = {
                'muted': false,
                'advance': false,
            }
            localStorage.setItem('player_settings', JSON.stringify(defaultSettings))
            return
        }
        this.settings = settings
        for (const [key, value] of Object.entries(settings)) {
            if (value == true) {
                switch (key) {
                    case 'muted':
                        this.toggleSound();
                    break;
                    case 'advance':
                        this.toggleAdvance()
                    break;
                }
            }
        }
    }
    

    updatePlayerSetting(key) {
        const settings = JSON.parse(localStorage.getItem('player_settings'))
        settings[key] = !settings[key]
        localStorage.setItem('player_settings', JSON.stringify(settings))
        this.settings = settings
    }
    updateProgress() {
        const current = this.video.currentTime

        this.timer.textContent = `
        ${formatTime(current)} / ${formatTime(this.duration)}
        `

        if (this.progressLine) {
            const percent = (current / this.duration) * 100;
            this.progressLine.style.width = `${percent}%`;
            if (percent >= 70 && !this.isViewed) {
                this.isViewed = true
                window.dispatchEvent(new CustomEvent('video:viewed'))
            }
        }
        if (!this.resumeTimeTimeout) {
            this.resumeTimeTimeout = setTimeout(() => {
                const resume = {
                    id: VIDEO_DATA.id,
                    seconds: this.video.currentTime
                }
                localStorage.setItem('player_resume_state', JSON.stringify(resume))
                this.resumeTimeTimeout = null
            }, 5000)
        }
    }
}