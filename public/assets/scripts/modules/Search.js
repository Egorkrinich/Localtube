export default class Search {
    constructor() {
        this.form = document.querySelector('#search-form')

        this.initListener()
    }
    initListener() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault()
            this.sendQuery()
        })
    }
    sendQuery() {
        const query = encodeURIComponent(this.form.search.value)
        window.location.href = `${BASE_URL}search?search=${query}`
    }
}