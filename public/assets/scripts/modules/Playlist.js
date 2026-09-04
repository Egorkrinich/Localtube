import { Templates } from "../Templates.js"

export class Playlist {
    Apis = {
        create: 'createPlaylist',
        edit: 'editPlaylist',
        delete: 'deletePlaylist'
    }
    editAttr = {
        btn: 'data-edit-btn',
        id: 'data-edit-id'
    }
    constructor(page) {
        if (page === "playlists") {
            this.createForm = document.querySelector('#create-playlist')

            this.editForm = document.querySelector('#edit-playlist')
            this.editList = this.editForm.querySelector('.playlist-menu__list')
        } else if (page === "watch") {
            const playlistId = new URLSearchParams(window.location.search).get('playlist')
            if (playlistId) this.renderPlaylistWatch(playlistId, 'general-container')
        }



        this.playlistId = null;

        this.videos = []
        this.isVideosChanged = false

        this.initListeners()
    }
    initListeners() {
        // Create new playlist listener
        this.createForm?.addEventListener('submit', (e) => {
            e.preventDefault()
            const formData = new FormData(this.createForm)

            this.sendData(formData, this.Apis.create)
        })

        // Edit playlist listeners
        window.addEventListener('edit', (e) => {
            if (this.playlistId != e.detail.id) {
                this.playlistId = e.detail.id
                this.initEditForm()
            }

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
            const editData = new FormData()

            const els = this.editForm.querySelectorAll('input, select')
            els.forEach((el) => {
                if (el.tagName === 'SELECT') {
                    const isChanged = Array.from(el.options)
                    .find((opt) => opt.defaultSelected).value !== el.value

                    if (isChanged) {
                        editData.append(el.name, el.value)
                    }
                    return;
                }
                const isChanged = el.value !== el.defaultValue;

                if (isChanged && el.value !== "") {
                    editData.append(el.name, el.value)
                }
            })

            if (this.isVideosChanged) {
                const videosData = this.videos.map((v) => {
                    return {id: v.id, deleted: v.deleted}
                })
                editData.append('videos', JSON.stringify(videosData))
            }

            const isEmpty = editData.keys().next().done
            if (!isEmpty) {
                editData.append('playlistId', this.playlistId)
                this.sendData(editData, this.Apis.edit)
            }
        })
        this.editForm?.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            const btn = e.target.closest(`[${this.editAttr.btn}=deletePlaylist]`)
            if (!btn) return
            if (confirm('Are you sure?')) {
                fetch(`${BASE_URL}API/Playlist/${this.Apis.delete}?playlistId=${this.playlistId}`)
                .then((res) => res.json())
                .then((data) => {
                window.dispatchEvent(new CustomEvent('toast', {
                    detail: {
                        success: data.success,
                        message: data.message
                    }
                }))
                })
            }
                    
        })
    }
    async initEditForm() {        
        const {info, videos} = await this.getPlaylist(this.playlistId)
        this.videos = videos.map((v) => ({...v, deleted: false}))
        
        this.editForm.title.value = info.title
        this.editForm.type.value = info.type

        this.editForm.title.defaultValue = info.title
        Array.from(this.editForm.type).forEach((opt) => {
            opt.defaultSelected = (opt.value === info.type)
        })
        this.renderPlaylistVideos()
    }

    renderPlaylistVideos() {
        this.editList.innerHTML = ""
        this.videos.forEach((video) => {
            const videoEl = Templates.playlistPreviewEdit(video)

            this.editList.insertAdjacentHTML('beforeend', videoEl)
        })
    }

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
    async renderPlaylistWatch(id, containerID) {
        const container = document.querySelector(`#${containerID}`)
        const {info, videos} = await this.getPlaylist(id)
        const playlist = Templates.playlistWatch(info, videos)
        container.insertAdjacentHTML("afterbegin", playlist)
    }

    getPlaylists() {
        return fetch(`${BASE_URL}API/Playlist/getPlaylists`)
        .then((res) => res.json())
    }
    getPlaylist(id) {
        return fetch(`${BASE_URL}API/Playlist/getPlaylist?id=${id}`)
        .then((res) => res.json())
    }    
    sendData(data, API) {
        fetch(`${BASE_URL}API/Playlist/${API}`, {
            method: 'POST',
            body: data
        })
        .then((res) => res.json())
        .then((data) => {
            switch (API) {
                case this.Apis.edit:
                    let message = ''
                    if (data.updatedFields) {
                        const length = data.updatedFields.length
                        const fieldsText = length > 1 ? 'fields ' : 'field '
                        const verb = length > 1 ? ' were ' : ' was '
                        message = fieldsText + data.updatedFields.join(', ') + verb + 'updated'
                    }
                    if (data.videosMessage) {
                        if (message.length > 0) {
                            message += ` and ` + data.videosMessage
                        } else {
                            message = data.videosMessage
                        }
                    }
                    if (data.warnings) {
                        if (message.length > 0) {
                            message += ` but ` + data.warnings.join(', ')
                        } else {
                            message = data.warnings.join(', ')
                        }
                    }
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            success: data.success,
                            message: message,
                        }
                    }))
                    setTimeout(() => { location.reload() }, 5000)
                break;
                default:
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            success: data.success,
                            message: data.message
                        }
                    }))
                    setTimeout(() => { location.reload() }, 5000)
                break;
            }
        })
    }

    movePosition(index, direction) {
        this.isVideosChanged = true
        const video = this.videos.splice(index, 1)[0]

        let newIndex = direction === 'up' ? index - 1 : index + 1
        const length = Number(this.videos.length)
        
        if (newIndex < 0) {
            newIndex = length
        } else if (newIndex > length) newIndex = 0

        this.videos.splice(newIndex, 0, video)
        this.renderPlaylistVideos()
    }
}