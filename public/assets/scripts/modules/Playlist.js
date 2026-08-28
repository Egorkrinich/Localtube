export class Playlist {
    constructor() {
        this.form = document?.querySelector('#playlist-form')

        this.initListeners()
    }
    initListeners() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault()
            const formData = new FormData(this.form)

            this.sendData(formData)
        })
    }
    sendData(data) {
        fetch(`${BASE_URL}API/Playlist/createPlaylist`, {
            method: 'POST',
            body: data
        })
        .then((res) => res.json())
        .then((data) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    message: data.message,
                    success: data.success
                }
            }))
        })
    }    
}