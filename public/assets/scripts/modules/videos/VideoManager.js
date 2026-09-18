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

        this.form = null
        this.thumbCont = null
        
        // Values
        this.videoId = null
        
        this.currentAction = null
        this.submitBtn = null

        this.uploadThumbURL = null
        this.editThumbURL = null

        this.initListeners()
        this.setStep(this.uploadForm, 1)
    }
    initListeners() {
        // Upload
        this.uploadForm.video.addEventListener('change', () => {
            this.setStep(this.uploadForm, 2)
        })
        this.uploadForm.thumb.addEventListener('change', (e) => {
            if (this.form !== this.uploadForm) {
                this.form = this.uploadForm
                this.thumbCont = this.uploadForm.querySelector('[data-manager-thumb-cont]')
            }
            const files = e.target.files
            if (files.length > 0) {
                const file = files[0];
                if (this.uploadThumbURL) {
                    this.thumbCont.firstElementChild.remove();
                    URL.revokeObjectURL(this.uploadThumbURL)
                }
                this.uploadThumbURL = URL.createObjectURL(file)
                
                this.createThumb('afterbegin', this.uploadThumbURL, 'Selected thumb')
            } 
        })
        this.uploadForm.addEventListener('submit', (e) => {
            e.preventDefault()

            this.submitBtn = this.uploadForm.querySelector('button[type="submit"]')
            this.submitBtn.disabled = true

            this.currentAction = 'upload'            

            this.collectUpload()
        })
        // Edit 
        window.addEventListener('initEditForm', (e) => {
            const id = e.detail.id
            this.form = this.editForm
            this.thumbCont = this.editForm.querySelector('[data-manager-thumb-cont]')
            if (this.videoId === id) return;
            
            this.videoId = id
            this.initEditForm() 
        })
        this.editForm.thumb.addEventListener('change', (e) => {
            const files = e.target.files
            if (files.length > 0) {
                const file = files[0];
                if (this.editThumbURL) {
                    this.thumbCont.firstElementChild.remove();
                    URL.revokeObjectURL(this.editThumbURL)
                }
                this.editThumbURL = URL.createObjectURL(file)
                
                this.createThumb('afterbegin', this.editThumbURL, 'Selected thumb')
            } 
        })
        this.editForm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.submitBtn = this.editForm.querySelector('button[type="submit"]')
            this.submitBtn.disabled = true
            this.currentAction = 'edit'

            this.collectEdit()
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
        const uploadData = new FormData(this.uploadForm)
        const videoFile = uploadData.get('video');

        if (videoFile) {
            const duration = await this.getVideoDuration(videoFile)
            uploadData.append('duration', duration)
            this.sendData(uploadData, 'upload')
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
            switch (this.API[this.currentAction]) {
                case this.API.edit:
                    let message = ''
                    if (res.updated.length > 0) {
                        const verb = res.updated.length > 1 ? ' were ' : ' was '
                        message = res.updated.join(', ') + verb + 'updated'
                    }
                    if (res.warnings.length > 0) {
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
                    
                    setTimeout(() => { location.reload() }, 4000)
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
            if (!res.success) {
                this.submitBtn.disabled = false
                this.submitBtn = null
            }
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
        .then((res) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    message: res.message,
                    success: res.success
                }
            }))
            if (res.success) { setTimeout(() => location.reload(), 2000) }
        })
    }
    


    initEditForm() {
        fetch(`${BASE_URL}API/Videos/${this.API.get}?id=${this.videoId}`)
        .then((res) => res.json())
        .then((res) => {
            this.editForm.title.value = res.title
            this.editForm.title.defaultValue = res.title

            this.thumbCont.innerHTML = ''

            if (this.editThumbURL) { URL.revokeObjectURL(this.editThumbURL) }
            this.createThumb('beforeend', BASE_URL + res.thumb, 'Current thumb')
        })
    }
    createThumb(pos, src, alt) {
        const html = `
        <div class="m-edit__thumb">
            ${alt}
            <img src="${src}" alt="${alt}">
        </div>
        `
        this.thumbCont.insertAdjacentHTML(pos, html)
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
}