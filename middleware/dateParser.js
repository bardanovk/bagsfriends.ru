module.exports = (dbDate) => {
    let tempDate = String(dbDate).split(' ')


    let day = Number(tempDate[2])
    let month

    switch (tempDate[1]) {
        case 'Jan':
            month = 'Января';
            break;
        case 'Feb':
            month = 'Февраля';
            break;
        case 'Mar':
            month = 'Марта';
            break;
        case 'Apr':
            month = 'Апреля';
            break;
        case 'May':
            month = 'Мая';
            break;
        case 'Jun':
            month = 'Июня';
            break;
        case 'Jul':
            month = 'Июля';
            break;
        case 'Aug':
            month = 'Августа';
            break;
        case 'Sep':
            month = 'Сентября';
            break;
        case 'Oct':
            month = 'Октября';
            break;
        case 'Nov':
            month = 'Ноября';
            break;
        case 'Dec':
            month = 'Декабря';
            break;
        default:
            break;
    }

    return '' + day + ' ' + month + ' ' + tempDate[3] + ' г.'
}