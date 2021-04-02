let arr
let arrl
window.onload = () => {
    document.querySelector('body').style = "display: block"
    arr = document.querySelectorAll('.navbar-buttons-button')
    arrl = document.querySelectorAll('.navbar-link')
    if (!document.querySelector('.catalog-navbar'))
        document.querySelector('.page-content').style.paddingTop = '17.5vh'
}

window.addEventListener('scroll', () => {

    if (document.documentElement.scrollTop !== 0 || window.pageYOffset !== 0) {
        document.getElementById('header').classList.add('header-minimal')
        document.getElementById('header-logo').classList.add('header-minimal-logo')
        arrl.forEach(element => {
            element.classList.add('navbar-links-minimal')
        });

        arr.forEach(element => {
            element.classList.add('header-buttons-minimal')
        });
        document.querySelector('.page-content').classList.add('page-content-minimal')
        if (document.querySelector('.catalog-navbar'))
            document.querySelector('.catalog-navbar-ul').classList.add('catalog-navbar-ul-minimal')
    } else {
        document.getElementById('header').classList.remove('header-minimal')
        document.getElementById('header-logo').classList.remove('header-minimal-logo')
        arr.forEach(element => {
            element.classList.remove('header-buttons-minimal')
        });
        arrl.forEach(element => {
            element.classList.remove('navbar-links-minimal')
        });
        document.querySelector('.navbar-link').classList.remove('navbar-links-minimal')
        document.querySelector('.page-content').classList.remove('page-content-minimal')
        if (document.querySelector('.catalog-navbar'))
            document.querySelector('.catalog-navbar-ul').classList.remove('catalog-navbar-ul-minimal')
    }
})