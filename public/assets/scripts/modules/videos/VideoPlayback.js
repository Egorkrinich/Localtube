export class VideoPlayback {
    constructor(playlist, videolist) {
        this.hasPlaylist = playlist?.length > 0

        this.currentList = this.hasPlaylist ? playlist : videolist

        this.playlistId = this.hasPlaylist ? 
        new URLSearchParams(window.location.search).get('playlist') : ''

        

        this.currentIndex = 0


        this.initListeners()
    }
    initListeners() {
        window.addEventListener('video:ended', () => this.playNext())
    }
    playNext() {
        if (this.hasPlaylist) this.currentIndex++
        if (this.hasPlaylist &&
            this.currentIndex >= this.currentList.length) this.currentIndex = 0

        const nextVideoId = this.currentList[this.currentIndex].id

        fetch(`${BASE_URL}API/Videos/getVideo?id=${nextVideoId}`)
        .then((res) => res.json())
        .then((nextVideo) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    success: true,
                    message: `Next video: ${nextVideo.title}`
                }
            }))
            setTimeout(() => {
                Object.assign(window.videoState, nextVideo)
                window.dispatchEvent(new CustomEvent('video:toggled'))
                history.pushState(null, '', BASE_URL + `watch?v=${nextVideoId}${this.hasPlaylist ? '&playlist=' + this.playlistId : ''}`)
            }, 2000);
        })
    }
}