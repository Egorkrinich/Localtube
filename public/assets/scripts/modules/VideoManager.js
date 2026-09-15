export class VideoManager {
    API = {
        upload: 'addVideo',
        edit: 'editVideo',
        delete: 'delVideo',
        get: 'getVideo',  
    }
    constructor() {
        // Forms
        this.uploadForm = document?.querySelector(`#upload`)
        this.editForm = document.querySelector(`#edit`)
        // Elements

        this.thumbContainer = this.editForm.querySelector('.m-edit__thumb-container')

        
        // Values
        this.videoId = null
        
        this.currentAction = null
        this.submitBtn = null

        this.initListeners()
        this.setStep(this.uploadForm, 1)
    }
    initListeners() {
        // Upload
        this.uploadForm.video.addEventListener('change', () => {
            this.setStep(this.uploadForm, 2)
        })
        this.uploadForm.addEventListener('submit', (e) => {
            e.preventDefault()

            this.submitBtn = this.uploadForm.querySelector('button[type="submit"]')
            this.submitBtn.disabled = true
            this.currentAction = 'upload'
            

            this.collectUpload(this.uploadForm, 'upload')
        })
        // Edit 
        window.addEventListener('initEdit', (e) => {
            const id = e.detail.id
            if (this.videoId !== id) {
                this.videoId = id
                this.initEditForm(this.videoId) 
            }
        })
        this.editForm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.submitBtn = this.uploadForm.querySelector('button[type="submit"]')
            this.submitBtn.disabled = true
            this.currentAction = 'edit'

            this.collectEdit()
        })
        this.editForm.addEventListener('change', (e) => {
            if (e.target.name !== 'thumb') return

            const files = e.target.files
            if (files.length > 0) {
                const file = files[0];
                this.newThumb = URL.createObjectURL(file)
                
                this.createThumb('afterbegin', this.newThumb, 'selected thumb')
            } 
        })
        // Delete
        window.addEventListener('video:delete', (e) => {
            if (confirm('Are you sure?')) {
                this.videoId = e.detail.id
                this.deleteVideo(this.videoId);
            }
        })
    }

    async collectUpload() {
        const formData = new FormData(this.uploadForm)
        const videoFile = formData.get('video');

        if (videoFile) {
            const duration = await this.getVideoDuration(videoFile)
            formData.append('duration', duration)
            this.sendData(formData, action)
        }
    }
    collectEdit() {
        const editData = new FormData()

        const inputs = this.editForm.querySelectorAll('input[type=text]')
        inputs.forEach((inp) => {
            const value = inp.value

            const isChanged = value !== inp.defaultValue;
            if (isChanged && value !== "") {
                editData.append(inp.name, value)
            }
        })
        const files = this.editForm.thumb.files
        if (files.length > 0) { editData.append('thumb', files[0]) }

        const isEmpty = editData.keys().next().done
        if (!isEmpty) {
            editData.append('id', this.videoId)
            this.sendData(editData)
        }
    }

    sendData(data) {
        const API = this.API[this.currentAction]
        fetch(`${BASE_URL}API/Videos/${API}`, {
            method: 'POST',
            body: data
        })
        .then((res) => res.json())
        .then((res) => {
            switch (this.currentAction) {
                case 'edit':
                    let message = ''
                    if (res.updated) {
                        const verb = res.updated.length > 1 ? ' were ' : ' was '
                        message = res.updated.join(', ') + verb + 'updated'
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
                    setTimeout(() => { location.reload() }, 5000)
                break;
                default:
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            message: res.message,
                            success: res.success
                        }
                    }))
                    if (res.success) setTimeout(() => location.reload(), 2000)
                break
            }
        })
        .finally(() => {
            this.submitBtn.disabled = false
            this.submitBtn = null
        })
    }
    deleteVideo() {
        const data = new FormData()
        data.append('id', this.videoId)

        fetch(`${BASE_URL}API/Videos/${this.API.delete}`, {
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
            if (data.success) {
                setTimeout(() => location.reload(), 2000)
            }
        })
    }
    

    setStep(form, number) {
        form.setAttribute('data-step', number);
    }
    getVideoDuration(file) {
        return new Promise((res) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                res(Math.floor(video.duration));
            };
        });
    }

    initEditForm() {
        fetch(`${BASE_URL}API/Videos/${this.API.get}?id=${this.videoId}`)
        .then((res) => res.json())
        .then((res) => {
            this.editForm.title.value = res.title
            this.editForm.title.defaultValue = res.title

            this.thumbContainer.innerHTML = ''
            if (this.newThumb) { URL.revokeObjectURL(this.newThumb) }
            this.createThumb('beforeend', BASE_URL + res.thumb, res.title)
        })
    }
    createThumb(pos, src, alt) {
        const img = document.createElement('img')
        img.classList.add('m-edit__thumb')
        img.src = src
        img.alt = alt
        this.thumbContainer.insertAdjacentElement(pos, img)
    }
}