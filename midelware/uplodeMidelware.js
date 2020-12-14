const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uplodes')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const uplode = multer({
  storage: storage,
  limits: {
    fileSize:1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    // const types = /jpg|png|gif/
    // const extName = types.test(path.extname(file.originalname).toLowerCase())
    // const mimetype = types.test(file.mimetype)
    // cb(null,true)
    // if(extName && mimetype){
    //   cb(null,true)
    // }else{
    //   cb(new Error('Only Supports Images'))
    // }
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
})

module.exports = uplode