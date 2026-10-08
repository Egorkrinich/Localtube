export default class Search {
    constructor() {
        this.form = document.querySelector('#search-form')

        this.initListener()
    }
    initListener() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault()
            const value = this.form.search.value.trim()
            if (value !== '') this.sendQuery(value)
        })
    }
    sendQuery(value) {
        const query = encodeURIComponent(value)
        window.location.href = `${BASE_URL}search?search=${query}`
    }
}