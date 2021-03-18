module.exports = (dbDate) => {
    //function dateparse(dbDate) {
    const ISODate = new Date(dbDate).toISOString().substring(0, 10)

    tempDate = String(ISODate).split('-')

    let month
    switch (tempDate[1]) {
        case '01':
            month = 'Января';
            break;
        case '02':
            month = 'Февраля';
            break;
        case '03':
            month = 'Марта';
            break;
        case '04':
            month = 'Апреля';
            break;
        case '05':
            month = 'Мая';
            break;
        case '06':
            month = 'Июня';
            break;
        case '07':
            month = 'Июля';
            break;
        case '08':
            month = 'Августа';
            break;
        case '09':
            month = 'Сентября';
            break;
        case '10':
            month = 'Октября';
            break;
        case '11':
            month = 'Ноября';
            break;
        case '12':
            month = 'Декабря';
            break;
        default:
            break;
    }

    return '' + tempDate[2] + ' ' + month + ' ' + tempDate[0] + ' г.'
}