import { Templates } from "../Templates.js"

export default class RenderVideos {
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
        let exclude = ''
        if (v && this.link === 'video') {
            exclude = `?v=${v}`
        }    
        fetch(`${BASE_URL}API/${this.linkSelector[this.link]}${exclude}`)
        .then((res) => res.json())
        .then((data) => {
            this.render(data)
        })
    }
    render(data) {
        data.forEach((video) => {
            video = {...video, 'ago': this.timeAgo(video.created)}
            const videoEl = Templates.preview(video, this.isHorizontal)

            this.container?.insertAdjacentHTML('beforeend', videoEl)
        })
    }
    timeAgo(date) {
        const now = new Date()
        const created = new Date(date);

        const diff = Math.floor((now - created) / 1000)

        if (diff < 60) return 'now';

        const minutes = Math.floor(diff / 60)
        if (minutes < 60) return `${minutes} min. ago`

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} h. ago`

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} d. ago`

        const weeks = Math.floor(days / 7);
        if (days < 30) return `${weeks} w. ago`

        const months = Math.floor(days / 30.44);
        if (months < 12) return `${months} mo. ago`

        const years = Math.floor(months / 12);
        return `${years} y. ago`
    }

}