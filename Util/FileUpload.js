const multer = require('multer')
const uniqid = require('uniqid')

const type = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

const fileUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images')
        },
        filename: (req, file, cb) => {
            const picname=uniqid('', '-'+file.originalname)
            cb(null,picname)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!type[file.mimetype]
        let error = isValid ? null : new Error('Invalid Type.')
        cb(error, isValid)
    }
})

module.exports = fileUpload

