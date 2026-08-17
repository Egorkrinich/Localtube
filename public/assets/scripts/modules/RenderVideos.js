import { Templates } from "../Templates.js"

export default class RenderVideos {
    constructor(container) {
        this.container = document.querySelector(`#${container}`)

        this.getData()
    }
    getData() {
        fetch(`${BASE_URL}API/Videos/getVideos`)
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