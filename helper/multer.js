const multer = require('multer');
const fs = require('fs');

module.exports = {
  uploader: (directory, fileNamePrefix) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDirectory = './public' + directory;

        if (fs.existsSync(pathDirectory)) {
          cb(null, pathDirectory);
        } else {
          fs.mkdir(pathDirectory, { recursive: true }, (err) => cb(err, pathDirectory));
        }
      },

      filename: (req, file, cb) => {
        const ext = file.originalname.split('.');

        const fileName = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1];

        cb(null, fileName);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (!/\.(jpg|jpeg|png|img|gif|pdf|txt|JPG|JPEG|PNG|IMG)/.test(file.originalname)) {
        return cb(new Error('File type not supported'), false);
      } else {
        cb(null, true);
      }
    };

    return multer({ storage, fileFilter });
  },
};
