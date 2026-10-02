import { formatTime, ops } from "../helper.js"

export class Player {
    attr = {
        action: 'data-player-action'
    }
    actions = {
        play:    'toggle-play',
        sound:   'toggle-sound',
        full:    'toggle-full',
        advance: 'toggle-advance',
        pip:     'toggle-pip'
    }
    actionBtns = {
        play:    document.querySelector(`[${this.attr.action}="${this.actions.play}"]`),
        sound:   document.querySelector(`[${this.attr.action}="${this.actions.sound}"]`),
        full:    document.querySelector(`[${this.attr.action}="${this.actions.full}"]`),
        advance: document.querySelector(`[${this.attr.action}="${this.actions.advance}"]`),
        pip:     document.querySelector(`[${this.attr.action}="${this.actions.pip}"]`)
    }
    handlers = {
        onPointerMove: (e) => {
            if (!this.isPaused) this.togglePlay(false) 
            this.scrub(e.offsetX)
        },
        onPointerUp: (e) => {
            window.removeEventListener('pointermove', this.handlers.onPointerMove)
            this.showControl(false)

            const exactX = e.clientX - this.PBarRect.left;
            this.scrub(exactX, 0)
        } 
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

        // -- State & Flags --
        this.isPaused = true
        this.isControlShowed = true
        
        this.duration = VIDEO_DATA.duration || 0
        
        
        this.playerRect = null
        this.PBarRect   = null
        
        this.controlDuration = USER_CONFIG.isMobile ? 5000 : 2000

        // -- Temporary states --
        this.controlTimeout = null
        this.resumeTimeout  = null

        this.lastTapTime    = null
        this.hasDoubleTap   = false
        this.wasPaused      = null
        
        // Progress bar states
        this.PBarTimeout     = null
        this.watchingPercent = 0


        // -- Details --
        this.settings = {};
        this.pipEnabled = document.pictureInPictureEnabled

        
        this.getSettings()
        this.updateProgress()
        this.initListeners()
        if (USER_CONFIG.isMobile) {
            this.initMobileListeners()
        } else {
            this.initDesktopListeners()
        }
        if (!this.pipEnabled && this.actionBtns.pip) {
           this.actionBtns.pip.style.display = 'none'; 
        }

    }
    initListeners() {
        this.control.addEventListener('pointerup', (e) => {
            if (e.button !== 0) return;

            const btn = e.target.closest(`[${this.attr.action}]`)
            if (!btn) {
                if (!this.isControlShowed && USER_CONFIG.isMobile) {
                    this.showControl()
                    return
                }

                if (!e.target.closest('.control__header, .control__body')) {
                    if (this.hasDoubleTap) {
                        this.togglePlay(!this.wasPaused)
                        this.hasDoubleTap = false
                        return
                    }
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
                case this.actions.pip:
                    this.togglePip()
                break;
            }
        })
        
        this.progressBar.addEventListener('pointerdown', (e) => {
            if (!this.PBarRect) {
                this.PBarRect = this.progressBar.getBoundingClientRect();
            }
            this.showControl(true)
            this.togglePlay(false)
            this.scrub(e.offsetX)

            window.addEventListener('pointermove', this.handlers.onPointerMove)
            window.addEventListener('pointerup', 
                this.handlers.onPointerUp, {once: true})
        })


        // -- System Listeners --
        if (this.pipEnabled) {
            this.video.addEventListener('leavepictureinpicture', () => {
                this.actionBtns.pip.classList.remove('active')
            })
        }
        this.video.addEventListener('timeupdate', () => this.updateProgress())
        this.video.addEventListener('ended', () => {
            this.togglePlay(false)
            if (this.settings.advance) {
                window.dispatchEvent(new CustomEvent('video:ended'))
            }
        })
        window.addEventListener('video:toggled', () => {
            setTimeout(() => {
                this.duration = VIDEO_DATA.duration
                this.video.currentTime = 0
                this.updateProgress()
                this.togglePlay(true)
            }, 0)
        })
        window.addEventListener('resize', () => {
            this.playerRect = this.player.getBoundingClientRect()
            this.PBarRect   = this.progressBar.getBoundingClientRect()
        })
    }
    initMobileListeners() {
        this.control.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
                
            const currentTime = performance.now();
            const tapDelay = currentTime - this.lastTapTime;

            if (tapDelay < 300 && tapDelay > 0) {
                if (!this.playerRect) {
                    this.playerRect = this.player.getBoundingClientRect()
                }

                const touchX = e.touches[0].clientX - this.playerRect.left
                this.hasDoubleTap = true

                const partWidth = this.playerRect['width'] / 3
                if (touchX < partWidth) {
                    this.skipTime('-')
                } else if (touchX > partWidth * 2) {
                    this.skipTime('+')
                }

                if (!this.wasPaused) {
                    this.control.classList.add('hide-instantly')
                    setTimeout(() => { this.showControl(false) }, 100)
                    setTimeout(() => { 
                        this.control.classList.remove('hide-instantly')
                    }, 500)
                }
                    
            } else { 
                this.wasPaused = this.isPaused 
            }

            this.lastTapTime = currentTime;
        });
    }
    initDesktopListeners() {
        this.control.addEventListener('mousemove', () => {
                if (this.isPaused) return;
                this.showControl()
        })
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

    togglePlay(forcePlay = null) {
        if (forcePlay !== null) {
            this.isPaused = !forcePlay
            forcePlay ? this.video.play() : this.video.pause()
            this.actionBtns.play.classList.toggle('active', forcePlay)
            this.startProgress()

            return
        }
        if (this.video.paused) {
            this.isPaused = false
            this.video.play()
            this.actionBtns.play.classList.add('active')

            this.showControl()
            this.startProgress()
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
    togglePip() {
        if (document.pictureInPictureEnabled) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
                this.actionBtns.pip.classList.remove('active')
            } else {
                this.video.requestPictureInPicture()
                .catch((e) => console.error("PiP error:", e));
                this.actionBtns.pip.classList.add('active')
            }
        }
    }
    showControl(forceVisibility = null) {
        if (this.controlTimeout) clearTimeout(this.controlTimeout)

        if (forceVisibility !== null) {
            this.control.classList.toggle('active', forceVisibility)
            this.isControlShowed = forceVisibility
            return  
        }
        
        this.control.classList.add('active')
        this.isControlShowed = true
        
        this.controlTimeout = setTimeout(() => { 
            if (this.isPaused) return

            this.control.classList.remove('active')
            this.isControlShowed = false
        }, this.controlDuration)
    }

    scrub(offsetX, time = 1500) {
        clearTimeout(this.PBarTimeout)

        let progressRatio = offsetX / this.PBarRect.width
        progressRatio = Math.max(0, Math.min(1, progressRatio))

        const scrubProgress = progressRatio * 100
        this.progressLine.style.width = `${scrubProgress}%`

        this.PBarTimeout = setTimeout(() => {
            const scrubTime = progressRatio * this.duration;
            this.video.currentTime = scrubTime;
            this.togglePlay(true)  
        }, time)
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

    // Utility Methods
    updatePlayerSetting(key) {
        const settings = JSON.parse(localStorage.getItem('player_settings'))
        settings[key] = !settings[key]
        localStorage.setItem('player_settings', JSON.stringify(settings))
        this.settings = settings
    }
    startProgress() {
        const loop = () => {
            if (!this.isPaused) {
                if (this.duration > 0) {
                    const current = this.video.currentTime
                    this.watchingPercent = (current / this.duration) * 100;
                    this.progressLine.style.width = `${this.watchingPercent}%`;
                }
                requestAnimationFrame(loop);
            }
        };
        requestAnimationFrame(loop);
    }
    updateProgress() {
        const current = this.video.currentTime

        this.timer.textContent = `
        ${formatTime(current)} / ${formatTime(this.duration)}
        `

        if (this.watchingPercent >= 70 && !this.isViewed) {
            this.isViewed = true
            window.dispatchEvent(new CustomEvent('video:viewed'))
        }

        if (!this.resumeTimeout) {
            this.resumeTimeout = setTimeout(() => {
                const resume = {
                    id: VIDEO_DATA.id,
                    seconds: this.video.currentTime
                }
                localStorage.setItem('player_resume_state', JSON.stringify(resume))
                this.resumeTimeout = null
            }, 5000)
        }
    }
}