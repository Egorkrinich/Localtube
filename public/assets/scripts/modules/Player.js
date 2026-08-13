export class Player {
    controls = {
        togglePlay: document.querySelector('#play-toggle'),
        toggleSound: document.querySelector('#sound-toggle'),
        toggleFull: document.querySelector('#full-toggle')
    }
    constructor() {
        this.player = document.querySelector('#video-player')

        this.video = document.querySelector('#video')

        this.progressBar = this.player.querySelector('#progress-bar')
        this.progressLine = document.querySelector('#progress-line')
        this.timer = document.querySelector('#timer')

        this.initListeners()
        this.initHotkeys()
        this.updateProgress()
    }
    initListeners() {
        this.controls.togglePlay.addEventListener('click', () => {
            this.togglePlay()
        })
        this.controls.toggleSound.addEventListener('click', () => {
            this.toggleSound()
        })
        this.controls.toggleFull.addEventListener('click', () => {
            this.toggleFull()
        })

        this.video.addEventListener('ended', () => {
            this.controls.togglePlay.classList.remove('active')
        })
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
            
        })
        this.progressBar.addEventListener('click', (e) => this.scrub(e));
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
            }
        })
    }
    
    scrub(e) {
        const scrubTime = (e.offsetX / this.progressBar.offsetWidth) * this.video.duration;
        this.video.currentTime = scrubTime;
    }

    togglePlay() {
        if (this.video.paused) {
            this.video.play()
            this.controls.togglePlay.classList.add('active')
        } else {
            this.video.pause()
            this.controls.togglePlay.classList.remove('active')
        }
    }
    toggleSound() {
        if (this.video.muted) {
            this.video.muted = false
            this.controls.toggleSound.classList.remove('active')
        } else {
            this.video.muted = true
            this.controls.toggleSound.classList.add('active')
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


    updateProgress() {
        const duration = this.video.duration
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