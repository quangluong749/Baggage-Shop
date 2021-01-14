const multer = require('multer')
const path = require('path');

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null,path.join(__dirname + '../../../public/images/users'));
  },
  filename: (req, file, callback) => {
    let ext = file.originalname.split('.').pop();
    let filename = req.user._id + '.' + ext;
    callback(null, filename);
  },
});

let uploadFile = multer({ storage: diskStorage }).single("file");

module.exports = uploadFile;