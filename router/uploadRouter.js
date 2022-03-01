const router = require('express').Router();
const { uploaderController } = require('../controller');

const { uploader } = require('../helper/multer');

router.post('/albums', uploader('/images', 'IMG').fields([{ name: 'file' }]), uploaderController.uploadFile);
router.get('/albums', uploaderController.getUploadFile);

module.exports = router;
