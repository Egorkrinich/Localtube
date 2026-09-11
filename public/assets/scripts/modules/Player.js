export class Player {
    controlBtns = {
        togglePlay:  document.querySelector('[data-player-btn="toggle-play"]'),
        toggleSound: document.querySelector('[data-player-btn="toggle-sound"]'),
        toggleFull:  document.querySelector('[data-player-btn="toggle-full"]')
    }
    ops = {
        '+': (a, b) => a + b, 
        '-': (a, b) => a - b 
    }
    constructor() {
        // -- Elements --
        this.player = document.querySelector('#player')
        this.video = this.player.querySelector('#player-video')
        this.control = this.player.querySelector('#player-control')
        this.rewind = this.player.querySelector('.rewind')

        this.progressBar = this.player.querySelector('#progress-bar')
        this.progressLine = document.querySelector('#progress-line')
        this.timer = document.querySelector('#timer')

        // -- State & Flags
        this.isPaused = true
        this.isControlShowed = true
        
        this.duration = VIDEO_DATA.duration || 0
        
        this.controlDuration = USER_CONFIG.isMobile ? 5000 : 2000
        
        // Temporary states
        this.controlHideTimeout = null
        this.lastTapTime = null
        

        this.initListeners()
        if (!USER_CONFIG.isMobile) {
            this.initHotkeys()
        }
        this.updateProgress()
    }
    initListeners() {
        this.video.addEventListener('timeupdate', () => this.updateProgress())
        this.video.addEventListener('ended', () => { 
            this.controlBtns.togglePlay.classList.remove('active')
        })
        // Global Listeners
        this.control.addEventListener('pointerdown', (e) => {
            const btn = e.target.closest(`[data-player-btn]`)
            if (!btn) {
                if (!this.isControlShowed && USER_CONFIG.isMobile) {
                    this.showControl()
                    return
                }
                // if NOT '.control__header' AND '.control__body'
                if (!e.target.closest('.control__header') && !e.target.closest('.control__body')) {
                    this.togglePlay()
                }
                return
            }
            const attrValue = btn.getAttribute(`data-player-btn`)

            switch (attrValue) {
                case 'toggle-play': 
                    this.togglePlay()
                break;
                case 'toggle-sound':
                    this.toggleSound()
                break;
                case 'toggle-full':
                    this.toggleFull()
                break
            }
        })
        this.progressBar.addEventListener('pointerdown', (e) => {
            this.scrub(e)
            const onMouseMove = (e) => this.scrub(e)

            window.addEventListener('pointermove', onMouseMove)

            window.addEventListener('pointerup', () => {
                window.removeEventListener('pointermove', onMouseMove)
            }, {once: true})
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
                break;
                case 'KeyF':
                    this.toggleFull()
                break;
                case 'ArrowLeft':
                    this.skipTime('+')
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
            this.controlBtns.togglePlay.classList.add('active')
            if (dblclick) {
                this.control.classList.add('hide-instantly')
                setTimeout(() => {this.showControl(false)}, 100)
                setTimeout(() => { 
                    this.control.classList.remove('hide-instantly')
                }, 500)
                return
            }

            setTimeout(() => { this.showControl(false) }, this.controlDuration)
        } else {
            this.isPaused = true
            this.video.pause()
            this.controlBtns.togglePlay.classList.remove('active')
            this.showControl(true)
        }
    }
    toggleSound() {
        if (this.video.muted) {
            this.video.muted = false
            this.controlBtns.toggleSound.classList.remove('active')
        } else {
            this.video.muted = true
            this.controlBtns.toggleSound.classList.add('active')
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
        this.video.currentTime = this.ops[action](this.video.currentTime, 5)

        this.rewind.classList.add(rewindClass)
        setTimeout(() => {this.rewind.classList.remove(rewindClass)}, 500)
    }


    updateProgress() {
        const current = this.video.currentTime

        this.timer.textContent = `
        ${this.formatTime(current)} / 
        ${this.formatTime(this.duration)}
        `

        if (this.progressLine) {
            const percent = (current / this.duration) * 100;
            this.progressLine.style.width = `${percent}%`;
            if (percent >= 70 && !this.isViewed) {
                this.isViewed = true
                window.dispatchEvent(new CustomEvent('video:viewed'))
            }
        }
    }

    formatTime(timeInSeconds) {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        
        if (hours > 0) {
            return `${hours}:${paddedMinutes}:${paddedSeconds}`;
        }
        return `${minutes}:${paddedSeconds}`;
    }
}