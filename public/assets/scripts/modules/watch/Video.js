export class Video {
    attrSelector = {
        btn: 'data-video-action',
        btnValue: 'data-video-btn-value',
        playlistId: 'data-video-playlist-id'

    }
    get selector() {
        return {
            like: this.cont.querySelector(`[${this.attrSelector.btn}="like"]`),
            dislike: this.cont.querySelector(`[${this.attrSelector.btn}="dislike"]`)
        }
    }
    constructor() {
        this.cont = document.querySelector('#video-body')

        this.videoId = new URLSearchParams(window.location.search).get('v')

        this.like    = Number(VIDEO_DATA['likes'])
        this.dislike = Number(VIDEO_DATA['dislikes'])

        this.countdown = null

        this.initListeners()
    }
    initListeners() {
        this.cont.addEventListener('pointerdown', (e) => {
            e.preventDefault()
            if (this.countdown) return
            
            const btn = e.target.closest(`[${this.attrSelector.btn}]`)
            if (!btn) return 
            const attr = btn.getAttribute(`${this.attrSelector.btn}`)

            
            
            switch (attr) {
                case 'like':
                    this.rate('like')
                    break;
                case 'dislike':
                    this.rate('dislike')
                break;
                case 'share':
                    navigator.clipboard.writeText(BASE_URL + 'watch?v=' + this.videoId);
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            message: 'Copied!',
                            success: true
                        }
                    }))
                    btn.disabled = false;
                break;
                case 'addToPlaylist':
                    const playlistId = 
                    btn.getAttribute(`${this.attrSelector.playlistId}`)
                    // window.dispatchEvent(new CustomEvent('playlist:add', {
                    //     detail: {
                    //         'playlistId': playlistId,
                    //         'videoId': this.videoId
                    //     }
                    // }))
                    // btn.disabled = false
                    this.addToPlaylist(playlistId)
                break;
            }
        })
        window.addEventListener('video:viewed', () => {
            fetch(`${BASE_URL}API/Videos/addView`, {
                method: 'POST',
                body: JSON.stringify({"id": this.videoId})
            })
        })
    }
    
    rate(action) {
        fetch(`${BASE_URL}API/Videos/rate`, {
            method: "POST",
            body: JSON.stringify({'id': this.videoId, 'action': action})
        })
        .then((res) => res.json())
        .then((res) => {
            if (!res.success) {
                window.dispatchEvent(new CustomEvent('toast', {
                    detail: {
                        message: res.message,
                        success: res.success
                    }
                }))
                return;
            }
            switch (res.action) {
                case '+':
                    this[action]++
                    window.videoState[`${action}s`] = Number(this.formatter(this[action]))
                break
                case '-':
                    this[action]--
                    window.videoState[`${action}s`] = this.formatter(this[action])
                break
                case '+-':
                    this[action]++
                    window.videoState[`${action}s`] = this.formatter(this[action])

                    const inverseAction = action === 'like' ? 'dislike' : 'like';
                    this[inverseAction]--     
                    window.videoState[`${inverseAction}s`] = 
                    this.formatter(this[inverseAction])
                break
            }
            this.countdown = setTimeout(() => this.countdown = null, 1000)
        })
    }
    addToPlaylist(playlistId) {       
        fetch(`${BASE_URL}API/Playlist/addToPlaylist`, {
            method: 'POST',
            body: JSON.stringify({
                'playlist_id': playlistId, 
                'video_id': this.videoId
            })
        })
        .then((res) => res.json())
        .then((res) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    success: res.success,
                    message: res.message
                }
            }))
            this.countdown = setTimeout(() => this.countdown = null, 1000)
        })
    }

    formatter(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 0;
        }
        const formatter = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        })

        return formatter.format(value)
    }
}