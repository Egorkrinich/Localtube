export class VideoManager {
    Apis = {
        delete: 'delVideo',
        upload: 'addVideo',
        edit: 'updateVideo'
    }
    constructor() {
        this.uploadForm = document.querySelector(`#upload`)
        // this.editForm    
        
        this.submitBtn = null
        
        this.videoId = null
        this.currentAction = null

        this.initListeners()
        this.setStep(this.uploadForm, 1)
    }
    initListeners() {
        // Upload
        this.uploadForm.video.addEventListener('change', () => 
            this.setStep(this.uploadForm, 2))
        this.uploadForm.addEventListener('submit', (e) => {
            e.preventDefault()

            this.submitBtn = this.uploadForm.querySelector('button[type="submit"]')
            this.submitBtn.disabled = true

            this.collectData(this.uploadForm, 'upload')
        })
        // Delete
        window.addEventListener('video:delete', (e) => {
            if (confirm('Are you sure?')) {
                this.videoId = e.detail.id
                this.deleteVideo(this.videoId);
            }
        })

    }    

    async collectData(form, action) {
        const formData = new FormData(form)
        const videoFile = formData.get('video');

        if (videoFile) {
            const duration = await this.getVideoDuration(videoFile)
            formData.append('duration', duration)
        }

        this.sendData(formData, action)
    }
    sendData(data, action) {
        const API = this.Apis[action]
        fetch(`${BASE_URL}API/Videos/${API}`, {
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
        .finally(() => {
            this.submitBtn.disabled = false
            this.submitBtn = null
        })
    }
    deleteVideo() {
        const data = new FormData()
        data.append('id', this.videoId)

        fetch(`${BASE_URL}API/Videos/delVideo`, {
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
}