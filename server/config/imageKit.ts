import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {HttpError} from '../utils/validation.js';
export const uploadDirectory=path.resolve(process.env.UPLOAD_DIR||'uploads');
export async function saveImage(file:Express.Multer.File){
 const b=file.buffer;
 const png=b.length>8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const jpg=b.length>3&&b[0]===255&&b[1]===216&&b[2]===255;
 const webp=b.length>12&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';
 if(!(png||jpg||webp))throw new HttpError(400,'The uploaded file is not a supported image');
 await mkdir(uploadDirectory,{recursive:true});
 const filename=randomUUID()+(png?'.png':jpg?'.jpg':'.webp');
 await writeFile(path.join(uploadDirectory,filename),b);
 return '/uploads/'+filename;
}
