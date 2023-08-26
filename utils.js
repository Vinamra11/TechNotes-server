import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function fileDirName(meta) {
    // returns __dirname
    //As the __dirname not defined in ESmodule scope

    const __filename = fileURLToPath(meta.url);

    const __dirname = dirname(__filename);

    return { __dirname, __filename };
}