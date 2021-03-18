let arr
let arrl
window.onload = () => {
    document.querySelector('body').style = "display: block"
    arr = document.querySelectorAll('.navbar-buttons-button')
    arrl = document.querySelectorAll('.navbar-link')
}

// window.onload = () => {
//     let arr = document.querySelectorAll('.navbar-buttons-button')
// }

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
        // // arr.forEach(element => {
        //     element.classList.add('header-buttons-minimal')
        // });
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
    }




})