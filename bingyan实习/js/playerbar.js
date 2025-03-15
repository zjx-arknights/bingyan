const playerbar_left = document.querySelector('.playerbar_left')
const playerbar_middle = document.querySelector('.playerbar_middle')
const musicscreen_image = document.querySelector('.musicscreen_image')
const musicplaybox = document.querySelector('.musicplaybox')
const add_music_to_mylist = document.querySelector('.add_music_to_mylist')
const playerbar_right_addmusic_image = document.querySelector('.playerbar_right_addmusic_image')
let rotated = false; // 状态标识，记录是否已经旋转过
musicscreen_image.addEventListener('click', () => {
    // 左侧元素消失并进行挤压
    playerbar_left.classList.toggle('disappear')

    // 中间元素向左移动
    playerbar_middle.classList.toggle('move')

    musicplaybox.classList.toggle('musicplaybox_active')
    // 为了防止出现点击过快的问题，可以在一定时间后清除挤压效果
    // setTimeout(() => {
    //     playerbar_left.style.display = 'none'// 左侧元素完全消失
    // }, 500) // 这里是与CSS动画时长一致，确保左侧元素被完全隐藏

    // 判断是否已经旋转过
    if (!rotated) {
        musicscreen_image.style.transform = 'rotate(180deg)';
        rotated = true;
    } else {
        musicscreen_image.style.transform = 'rotate(0deg)';
        rotated = false;
    }
})

playerbar_right_addmusic_image.addEventListener(('click'), () => {
    add_music_to_mylist.classList.toggle('add_music_to_mylist_active')
    //共用一个蒙版

})
