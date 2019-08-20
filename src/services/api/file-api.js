export default {
  uploadFile(file, mimetype, size, name) {
    return this.post(`/api/files?mimetype=${mimetype}&name=${name}&size=${size}`, file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};
