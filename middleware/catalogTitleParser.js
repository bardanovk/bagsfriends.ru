module.exports = (category) => {
    switch (category) {
        case 'woman':
            return 'Женское'
        case 'man':
            return 'Мужское'
        case 'wallets':
            return 'Портмоне | Кошельки'
        case 'bags':
            return 'Сумки'
        case 'belts':
            return 'Ремни'
        case 'accessories':
            return 'Аксессуары'
        default:
            return 'Bagsfriends.ru';
    }

}