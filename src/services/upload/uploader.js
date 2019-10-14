export default class Uploader {
  constructor(axiosInstance) {
    this.axios = axiosInstance;
  }

  uploadAll(attachments) {
    return Promise.all(attachments.map(attachment => this.upload(attachment)));
  }

  upload(attachment) {
    attachment.upload.uploading = true;
    const formData = new FormData();

    formData.append("file", attachment.file);

    return this.axios
      .post(`/api/files?mimetype=${attachment.type}&name=${attachment.name}&size=${attachment.size}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          attachment.upload.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      })
      .then(({ data }) => {
        attachment._id = data._id;
        return attachment;
      })
      .catch(err => {
        attachment.upload.error = err;
        return { attachment };
      });
  }
}
