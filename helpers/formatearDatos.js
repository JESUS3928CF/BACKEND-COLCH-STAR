const formatDate = date => {

    return date;
    
}

const formatMoney = (value) => {

    return (value)
}

const capitalizarPrimeraLetras = (cadena) => {
    return cadena
        .toLowerCase()
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

module.exports = {formatDate, formatMoney, capitalizarPrimeraLetras};