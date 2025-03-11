const sidebar_shrink = document.querySelector('.sidebar_shrink')
const sidebar = document.querySelector('.sidebar')
const sidebar_create = document.querySelector('.sidebar_create')
const sidebar_up = document.querySelector('.sidebar_up')
const list = document.querySelectorAll('.sidebar .list')
const search_bar = document.querySelector('.search-bar')
const exchange_ = document.querySelector('.exchange')
const music_types = document.querySelector('.music_types')
const content = document.querySelector('.content')
sidebar_shrink.addEventListener('click', () => {
    // sidebar.classList.toggle('sidebar_active')
    list.forEach(item => {
        item.classList.toggle('sidebarin_active');
        //     item.style.width = '20px' // 遍历 NodeList，设置每个元素的宽度
    });
    sidebar.classList.toggle('sidebar_active')
    search_bar.classList.toggle('search_bar_active')
    exchange_.classList.toggle('exchange_active')
    music_types.classList.toggle('music_types_active')
    content.classList.toggle('content_active')
})
