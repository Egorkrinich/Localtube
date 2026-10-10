import { Templates } from "../Templates.js"

export default class Search {
    constructor() {
        this.form = document.querySelector('#search-form')

        this.searchParam = new URLSearchParams(window.location.search)
        .get('s')
        
        if (this.searchParam) {
            this.sendQuery()
        }
        

        this.initListener()
    }
    initListener() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault()
            const value = this.form.search.value.trim()
            if (value === '') return
            const query = encodeURIComponent(value)
            console.log(query)
            window.location.href = `search?s=${query}`
        })
    }
    sendQuery() {
        fetch(`API/Search/getResult?s=${this.searchParam}`)
        .then((res) => res.json())
        .then((videos) => {
            const videosHTML = videos
            .map((v) => Templates.preview(v, true)).join('')
            const container = document.querySelector('#search-container')
            container?.insertAdjacentHTML('beforeend', videosHTML)
        })
    }
}