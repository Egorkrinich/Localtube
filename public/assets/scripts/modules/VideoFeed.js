import { Templates } from "../Templates.js"

export class VideoFeed {
    API = {
        history: 'History/getHistory',
        video:   'Videos/getVideos',
        manager: 'Videos/getMyVideos'
    }
    constructor(link, previewType) {
        this.container = document.querySelector("#preview-container")
        this.isHorizontal = previewType === 'h' ? true : false 

        this.link = this.API[link]


        this.rawVideos = [];

        this._videosLoaded = this.getVideos()
        this.initListeners()
    }
    initListeners() {
        window.addEventListener('video:toggled', () => {
            this.container.innerHTML = ''
            this.getVideos()
        })
    }
    getVideos() {
        const URLParams = new URLSearchParams(window.location.search)
        const videoId = URLParams.get('v')
        const playlistId = URLParams.get('playlist')
        let exclude = ''

        if (videoId && this.link === this.API.video) {
            exclude = `?v=${videoId}`
            if (playlistId) exclude += `&playlist=${playlistId}`
        }
        fetch(`${BASE_URL}API/${this.link}${exclude}`)
        .then((res) => res.json())
        .then((videos) => {
            const videosHTML = videos
            .map((v) => Templates.preview(v, this.isHorizontal)).join('')
            this.container?.insertAdjacentHTML('beforeend', videosHTML)
            this.collectRaw(videos)
        })
    }
    collectRaw(videos) {
        this.rawVideos.length = 0
        videos.forEach((v) => {
            this.rawVideos.push({
                'id':              v.id,
                'thumb':           v.thumb, 
                'title':           v.title, 
                'duration':        v.duration,
                'uploader_avatar': v.uploader_avatar,
                'views':           v.views,
                'created':         v.created
            })
        })
    }
    get ready() { return this._videosLoaded }
}