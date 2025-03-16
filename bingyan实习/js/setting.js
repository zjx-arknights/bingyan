function setting() {
    let setting_down = document.querySelector('.setting_down')
    setting_down.classList.toggle('setting_active')
}

let a = document.querySelector('.a')
let b = document.querySelector('.b')
let d = document.querySelector('.d')

a.addEventListener('click', () => {
    document.documentElement.removeAttribute('data-theme');
    if (document.querySelector('.new-bg'))
        document.querySelector('.new-bg').classList.remove('new-bg')
    a.style.width = '250px'
    b.style.width = '150px'
    b.style.textDecoration = 'line-through'
    a.style.textDecoration = 'none'
})

// a.addEventListener('mouseleave', () => {
//     a.style.width = '200px'
//     b.style.width = '200px'
//     b.style.textDecoration = 'none'
// })

b.addEventListener('click', () => {
    let b_right = b.getBoundingClientRect()
    document.documentElement.setAttribute('data-theme', 'dark');
    if (!document.querySelector('.new-bg'))
        document.querySelector('.musicplaybox').classList.add('new-bg')
    b.style.right = b_right + 'px'
    b.style.width = '250px'
    a.style.width = '150px'
    a.style.textDecoration = 'line-through'
    b.style.textDecoration = 'none'
})

// b.addEventListener('mouseleave', () => {
//     b.style.width = '200px'
//     a.style.width = '200px'
//     a.style.textDecoration = 'none'
// })

