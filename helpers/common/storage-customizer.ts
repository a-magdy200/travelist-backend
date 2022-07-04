import multer, { StorageEngine } from 'multer'
import { UPLOAD_DIRECTORY } from '../constants/directories'

const storage = (directory: string): StorageEngine => {
	return multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, `${UPLOAD_DIRECTORY}${directory}`)
		},
		filename: function (req, file, cb) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
			cb(null, `${uniqueSuffix}-${file.originalname}`)
		},
	})
}
export { storage }
