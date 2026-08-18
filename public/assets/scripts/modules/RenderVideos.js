import { Templates } from "../Templates.js"

export default class RenderVideos {
    linkSelector = {
        history: 'History/getHistory',
        video: 'Videos/getVideos',
    }
    constructor(link) {
        this.container = document.querySelector("#preview-container")
        this.link = link

        this.getData()
    }
    getData() {
        fetch(`${BASE_URL}API/${this.linkSelector[this.link]}`)
        .then((res) => res.json())
        .then((data) => {
            this.render(data)
        })
    }
    render(data) {
        data.forEach((video) => {
            const videoEl = 
            Templates.preview(video)

            this.container?.insertAdjacentHTML('beforeend', videoEl)
        })
    }

}