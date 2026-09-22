import { Templates } from "../../Templates.js"

export class PlayAdvance {
    constructor(playlist, videolist) {
        this.PAContainer = document.querySelector('#player-advance')

        this.hasPlaylist = playlist?.length > 0
        this.currentList = this.hasPlaylist ? playlist : videolist

        this.URLParams = new URLSearchParams(window.location.search)

        this.playlistId = this.hasPlaylist ? this.URLParams.get('playlist') : null 
        this.videoId    = this.URLParams.get('v') || null
        

        

        this.currentIndex = this.hasPlaylist ? this.currentList
        .findIndex(({id}) => id === this.videoId) : 0


        this.initListeners()
    }
    initListeners() {
        window.addEventListener('video:ended', () => this.playAdvance())
    }
    playAdvance() {
        if (this.hasPlaylist) this.currentIndex++
        if (this.hasPlaylist &&
            this.currentIndex >= this.currentList.length) this.currentIndex = 0

        const nextVideoId = this.currentList[this.currentIndex].id
        
        this.PAContainer.classList.add('active')
        this.PAContainer.innerHTML = 
        Templates.preview(this.currentList[this.currentIndex])

        fetch(`${BASE_URL}API/Videos/getVideo?id=${nextVideoId}`)
        .then((res) => res.json())
        .then((nextVideo) => {
            setTimeout(() => {
                const playlistURL = this.hasPlaylist ? 
                '&playlist=' + this.playlistId : ''

                Object.assign(window.videoState, nextVideo)
                this.PAContainer.classList.remove('active')
                this.PAContainer.innerHTML = ''

                history.pushState(null, '', 
                    BASE_URL + `watch?v=${nextVideoId}${playlistURL}`
                )

                window.dispatchEvent(new CustomEvent('video:toggled'))
            }, 4000);
        })
    }
}