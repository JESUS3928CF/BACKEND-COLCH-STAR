const checkAut = (req, res, next) => {
    let token;

    // Buscar en el objeto de header la autorización
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token);
        } catch (error) {
            const e = new Error('Token no valido');
            return res.status(403).json({ message: e.message });
        }
    }

    // en caso contrario mandar un error
    if (!token) {
        const error = new Error('Token no Válido o inexistente');
        res.status(403).json({ message: error.message });
    }

    next();
};

module.exports = { checkAut };
