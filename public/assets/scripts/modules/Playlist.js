import { Templates } from "../Templates.js"

export class Playlist {
    API = {
        create: 'createPlaylist',
        add: 'addToPlaylist',
        edit: 'editPlaylist',
        delete: 'deletePlaylist',
        get: 'getPlaylist'
    }
    editAttr = {
        btn: 'data-pl-edit-btn',
        id: 'data-pl-edit-id'
    }

    constructor(page) {
        this.URLParams = new URLSearchParams(window.location.search)
        this.playlistId = this.URLParams.get('playlist') ?? null

        if (page === "playlists") {

        this.createForm = document.querySelector('#create-playlist')

        this.editForm = document.querySelector('#edit-playlist')
        this.editList = this.editForm.querySelector('.playlist-menu__list')

        } else if (page === "watch") {
        if (!this.playlistId) return

        this._playlistLoaded = 
        this.renderPlaylistWatch('general-container')

        this.rawVideos = []
        
        }

        this.submitBtn = null
        
        this.isVideosChanged = false
        this.videos = []

        if (page === "playlists") this.initPlaylistsListeners() 
        else if (page === "watch") this.initWatchListeners()
    }
    initPlaylistsListeners() {
        // Create new playlist listener
        this.createForm?.addEventListener('submit', (e) => {
            e.preventDefault()
            const createData = new FormData(this.createForm)

            this.sendData(createData, this.API.create)
        })

        // Edit playlist listeners
        window.addEventListener('initEditForm', (e) => {
            if (this.playlistId === e.detail.id) return
            this.playlistId = e.detail.id
            this.initEditForm()
        })
        this.editList?.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            const btn = e.target.closest(`[${this.editAttr.btn}]`)
            if (!btn) return

            const attr = btn.getAttribute(this.editAttr.btn)
            const id = btn.closest(`[${this.editAttr.id}]`)
            .getAttribute(this.editAttr.id)

            const index = this.videos.findIndex(video => video.id === id)
            switch (attr) {
                case 'moveUp': 
                    this.movePosition(index, 'up'); 
                break;
                case 'moveDown': 
                    this.movePosition(index, 'down');
                break;
                case 'delete':
                    this.isVideosChanged = true
                    const el = e.target.closest('.preview')
                    el.classList.toggle('deleted')
                    this.videos[index].deleted = !this.videos[index].deleted
                break;
            }
        })
        this.editForm?.addEventListener('submit', (e) => {
            e.preventDefault()
            this.collectEditForm()
        })
        this.editForm?.addEventListener('click', (e) => {
            const btn = e.target.closest(`[${this.editAttr.btn}=deletePlaylist]`)
            if (!btn) return
            if (confirm('Are you sure?')) {

                fetch(`${BASE_URL}API/Playlist/${this.API.delete}?playlistId=${this.playlistId}`)
                .then((res) => res.json())
                .then((res) => {
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            success: res.success,
                            message: res.message
                        }
                    }))
                    if (res.success) setTimeout(() => location.reload(), 2000)
                })
            }
                    
        })
    }
    initWatchListeners() {
        // window.addEventListener('playlist:add', (e) => {
        //     const {playlistId, videoId} = e.detail
        // })
    }

    // -- Playlists page methods --
    
    async renderPlaylists(containerID) {
        const container = document.querySelector(`#${containerID}`)
        if (!container) return

        const playlists = await this.getPlaylists()
        if (!playlists) return
        
        playlists.forEach((playlist) => {
            const videoEl = Templates.playlistPreview(playlist)
            container.insertAdjacentHTML('beforeend', videoEl)
        })
    }

    // Edit form
    async initEditForm() {
        const {details, videos} = await this.getPlaylist(this.playlistId)
        this.videos = videos.map((v) => ({...v, deleted: false}))
        
        this.editForm.title.value = details.title
        this.editForm.type.value = details.type

        this.editForm.title.defaultValue = details.title
        Array.from(this.editForm.type).forEach((opt) => {
            opt.defaultSelected = (opt.value === details.type)
        })
        this.renderEditVideos()
    }
    renderEditVideos() {
        this.editList.innerHTML = ""
        this.videos.forEach((video) => {
            const videoEl = Templates.playlistPreviewEdit(video)

            this.editList.insertAdjacentHTML('beforeend', videoEl)
        })
    }
    collectEditForm() {
        const editData = new FormData()

        const fields = this.editForm.querySelectorAll('input, select')
        fields.forEach((field) => {
            if (field.tagName === 'SELECT') {
                const isChanged = Array.from(field.options)
                .find((opt) => opt.defaultSelected).value !== field.value

                if (isChanged) editData.append(field.name, field.value)
                return;
            }
            const isChanged = field.value !== field.defaultValue;
            
            if (isChanged && field.value !== "") {
                editData.append(field.name, field.value)
            }
        })
        if (this.isVideosChanged) {
            const videosData = this.videos.map(({id, deleted}) => {
                return {id, deleted}
            })
            editData.append('videos', JSON.stringify(videosData))
        }

        const isEmpty = editData.keys().next().done
        if (!isEmpty) {
            editData.append('playlistId', this.playlistId)
            this.sendData(editData, this.API.edit)
        }
    }

    // Create form

    // -- Watch page methods --
    
    async renderPlaylistWatch(containerID) {
        const {details, videos} = await this.getPlaylist()

        const container = document.querySelector(`#${containerID}`)
        const playlist = Templates.playlistWatch(details, videos)
        container.insertAdjacentHTML("afterbegin", playlist)

        videos.forEach((
            {
                id, thumb, title, duration, 
                uploader_avatar, views, created
            }) => {
            this.rawVideos.push(
                {
                    id, thumb, title, duration,
                    uploader_avatar, views, created
                })
        })

        return;
    }


    // -- GET and POST --
    getPlaylists() {
        return fetch(`${BASE_URL}API/Playlist/getPlaylists`)
        .then((res) => res.json())
    }
    getPlaylist() {
        return fetch(`${BASE_URL}API/Playlist/${this.API.get}?id=${this.playlistId}`)
        .then((res) => res.json())
    }

    sendData(data, API) {
        fetch(`${BASE_URL}API/Playlist/${API}`, {
            method: 'POST',
            body: data
        })
        .then((res) => res.json())
        .then((res) => {
            switch (API) {
                case this.API.edit:
                    let message = ''
                    if (res.updated) {
                        const length = res.updated.length
                        const join = length == 2 ? ' and ' : ', '
                        const verb = length > 1 ? ' were ' : ' was '
                        message = res.updated.join(join) + verb + 'updated'
                    }
                    if (res.videosMessage) {
                        if (message.length > 0) {
                            message += ` and ` + res.videosMessage
                        } else {
                            message = res.videosMessage
                        }
                    }
                    if (res.warnings) {
                        if (message.length > 0) {
                            message += ` but ` + res.warnings.join(', ')
                        } else {
                            message = res.warnings.join(', ')
                        }
                    }
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            success: res.success,
                            message: message,
                        }
                    }))
                    setTimeout(() => { location.reload() }, 3000)
                break;
                default:
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            success: res.success,
                            message: res.message
                        }
                    }))
                    setTimeout(() => { location.reload() }, 3000)
                break;
            }
        })
    }

    // -- Helpers --

    movePosition(index, direction) {
        this.isVideosChanged = true
        const video = this.videos.splice(index, 1)[0]

        let newIndex = direction === 'up' ? index - 1 : index + 1
        const length = Number(this.videos.length)
        
        if (newIndex < 0) {
            newIndex = length
        } else if (newIndex > length) newIndex = 0

        this.videos.splice(newIndex, 0, video)
        this.renderEditVideos()
    }

    get ready() { return this._playlistLoaded }
}