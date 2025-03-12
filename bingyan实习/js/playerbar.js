const playerbar_left = document.querySelector('.playerbar_left')
const playerbar_middle = document.querySelector('.playerbar_middle')
const musicscreen_image = document.querySelector('.musicscreen_image')
const musicplaybox = document.querySelector('.musicplaybox')
musicscreen_image.addEventListener('click', () => {
    // 左侧元素消失并进行挤压
    console.log('44')
    playerbar_left.classList.toggle('disappear')

    // 中间元素向左移动
    playerbar_middle.classList.toggle('move')

    musicplaybox.classList.toggle('musicplaybox_active')
    // 为了防止出现点击过快的问题，可以在一定时间后清除挤压效果
    // setTimeout(() => {
    //     playerbar_left.style.display = 'none'// 左侧元素完全消失
    // }, 500) // 这里是与CSS动画时长一致，确保左侧元素被完全隐藏

})

