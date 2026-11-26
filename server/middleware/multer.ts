import multer from 'multer';
import {HttpError} from '../utils/validation.js';
export default multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1},fileFilter:(_req,file,cb)=>{
 if(!['image/jpeg','image/png','image/webp'].includes(file.mimetype))return cb(new HttpError(400,'Upload a JPEG, PNG, or WebP image (up to 5 MB)'));
 cb(null,true);
}});
