const exchange = document.querySelectorAll('li')
const music_types_list = document.querySelectorAll('.music_types_list')
const hotmusic = document.getElementById('hotmusic')

for (let i = 0; i < exchange.length; i++) {

    exchange[i].addEventListener('click', function () {

        document.querySelector('.active').classList.remove('active')

        this.classList.add('active')
    })
}//切换音频来源

for (let i = 0; i < music_types_list.length; i++) {

    music_types_list[i].addEventListener('click', function () {
        document.querySelector('.music_types_list_active').classList.remove('music_types_list_active')

        this.classList.add('music_types_list_active')
    })
}//切换音频来源

function turn_to_hot() {
    if (search_show.classList.contains('search_show_show')) {
        // 如果没有，添加一个
        search_show.classList.remove('search_show_show')
    }

}
