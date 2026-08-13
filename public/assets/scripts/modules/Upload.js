export class Upload {
    constructor() {
        this.form = document.querySelector(`#upload`)

        this.initListeners()
        this.setStep(1)
    }
    initListeners() {
        this.form.video.addEventListener('change', () => this.setStep(2))
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.collectData()
        })
    }
    throwData(data) {
        fetch(`${BASE_URL}API/addVideo`, {
            method: 'POST',
            body: data
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.message)
        })
    }
    async collectData() {
        const formData = new FormData(this.form)
        const videoFile = formData.get('video');

        if (videoFile) {
            const duration = await this.getVideoDuration(videoFile)
            formData.append('duration', duration)
        }

        this.throwData(formData)
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
    setStep(number) {
        this.form.setAttribute('data-step', number);
    }
}