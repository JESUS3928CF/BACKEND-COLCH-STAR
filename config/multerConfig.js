const multer = require('multer'); //- es necesaria para gestionar la carga de archivos en Node.js.
const shortid = require('shortid'); //-  se utiliza para generar nombres de archivo únicos.

const configurarMulter = (directorio) =>{
    const configurationMulter = {
        storage: (fileStorage = multer.diskStorage({
            /// Aca le decimos el directorio donde se almacenara el archivo
            destination: (req, file, cb) => {
                cb(null, `${__dirname + '../../uploads/'}${directorio}`);
            },
            /// Aca generamos un nombre con shortid
            filename: (req, file, cb) => {
                const extension = file.mimetype.split('/')[1];
                cb(null, `${shortid.generate()}.${extension}`);
            },
        })),
        fileFilter(req, file, cb) {
            if (
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png'
            ) {
                cb(null, true);
            } else {
                cb(new Error('Formato No válido'));
            }
        },
    };

    return configurationMulter
}

module.exports = configurarMulter;
