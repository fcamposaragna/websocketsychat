import {fileURLToPath} from 'url';
import {dirname} from 'path';
import { normalize,schema } from 'normalizr';

const filename= fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export default __dirname

export const normalizedMessage = (data)=>{
    const author = new schema.Entity('author',{},{idAttribute:"_id"});
    const messages = new schema.Entity('messages',{
        author:author
    },{idAttribute:"_id"});
    const parentObject = new schema.Entity('parent',{
        messages:[messages]
    });
    const normalizedObject = normalize(data,parentObject)
    return normalizedObject
}