export class Player {
    controlBtns = {
        togglePlay:  document.querySelector('[data-player-btn="toggle-play"]'),
        toggleSound: document.querySelector('[data-player-btn="toggle-sound"]'),
        toggleFull:  document.querySelector('[data-player-btn="toggle-full"]')
    }
    constructor() {
        // -- Elements --
        this.player = document.querySelector('#player')
        this.video = this.player.querySelector('#player-video')
        this.control = this.player.querySelector('#player-control')

        this.progressBar = this.player.querySelector('#progress-bar')
        this.progressLine = document.querySelector('#progress-line')
        this.timer = document.querySelector('#timer')

        // -- State & Flags
        this.timeout = null;

        this.isPaused = true

        this.initListeners()
        this.initHotkeys()
        this.updateProgress()
    }
    initListeners() {
        this.control.addEventListener('click', (e) => {
            const btn = e.target.closest(`[data-player-btn]`)
            if (!btn) {
                if (!e.target.closest('.control__header') && 
                    !e.target.closest('.control__body')) {
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
        this.control.addEventListener('mousemove', () => {
            if (this.isPaused) return;
            this.showControl(false)
        })
            

        this.video.addEventListener('ended', () => {
            this.controlBtns.togglePlay.classList.remove('active')
        })
        this.video.addEventListener('timeupdate', () => this.updateProgress())


        this.progressBar.addEventListener('mousedown', (e) => {
            this.scrub(e)
            const onMouseMove = (e) => this.scrub(e)
            window.addEventListener('mousemove', onMouseMove)

            window.addEventListener('mouseup', () => {
                window.removeEventListener('mousemove', onMouseMove)
            }, {once: true})
        })
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
                    this.video.currentTime -= 5
                break;
                case 'ArrowRight':
                    this.video.currentTime += 5
                break;
            }
        })
    }
    
    togglePlay() {
        if (this.video.paused) {
            this.isPaused = false
            this.video.play()
            this.controlBtns.togglePlay.classList.add('active')
            this.showControl(true, false)
        } else {
            this.isPaused = true
            this.video.pause()
            this.controlBtns.togglePlay.classList.remove('active')
            this.showControl(true, true)
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
    showControl(constantly, isAdd) {
        if (constantly) {
            if (this.timeout) clearTimeout(this.timeout)
            this.control.classList.toggle('active', isAdd)
            return
        }
        if (this.timeout) clearTimeout(this.timeout)
        
        this.control.classList.add('active')
        this.timeout = setTimeout(() => { 
            this.control.classList.remove('active')
        }, 2000)
    }
    scrub(e) {
        const scrubTime = (e.offsetX / this.progressBar.offsetWidth) * this.video.duration;
        this.video.currentTime = scrubTime;
    }


    updateProgress() {
        const duration = VIDEO_DATA.duration || 0
        const current = this.video.currentTime

        this.timer.textContent = `${this.formatTime(current)} / ${this.formatTime(duration)}`

        if (this.progressLine) {
            const percent = (current / duration) * 100;
            this.progressLine.style.width = `${percent}%`;
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