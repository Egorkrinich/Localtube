import { Templates } from "../Templates.js"

export class RenderVideos {
    linkSelector = {
        history: 'History/getHistory',
        video: 'Videos/getVideos',
        manager: 'Videos/getMyVideos'
    }
    constructor(link, type) {
        this.container = document.querySelector("#preview-container")
        this.isHorizontal = type === 'h' ? true : false 

        this.link = link

        this.getData()
    }
    getData() {
        const v = new URLSearchParams(window.location.search).get('v')
        const playlistId = new URLSearchParams(window.location.search).get('playlist')
        let exclude = ''
        if (v && this.link === 'video') {
            exclude = `?v=${v}`
            if (playlistId) exclude += `&playlist=${playlistId}`
        }
        fetch(`${BASE_URL}API/${this.linkSelector[this.link]}${exclude}`)
        .then((res) => res.json())
        .then((data) => {
            this.render(data)
        })
    }
    render(data) {
        data.forEach((video) => {
            const videoEl = Templates.preview(video, this.isHorizontal)

            this.container?.insertAdjacentHTML('beforeend', videoEl)
        })
    }
}