const formatDate = date => {
    const newDate = new Date(date);
    return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(
        newDate
    );
}

const formatMoney = (value) => {
    // const formatter = new Intl.NumberFormat("es-US", {
    //     style: 'currency',
    //     currency: 'USD'
    // })

    // return formatter.format(value)
    return value;
}

module.exports = {formatDate, formatMoney};