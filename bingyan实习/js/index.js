const exchange = document.querySelectorAll('li')
for (let i = 0; i < exchange.length; i++) {

    exchange[i].addEventListener('click', function () {

        document.querySelector('.active').classList.remove('active')

        this.classList.add('active')
    })
}//切换音频来源

