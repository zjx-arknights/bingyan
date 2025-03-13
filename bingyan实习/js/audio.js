const playerbar_middle_up_middle_copy = document.querySelector('.playerbar_middle_up_middle')

function checkAudioPlaying() {
    // 判断 audio 元素是否正在播放
    audio.addEventListener('play', () => {
        console.log('a')
        playerbar_middle_up_middle_copy.innerHTML = ``
        const box = document.createElement('div')
        box.classList.add('playerbar_middle_up_middle_startmask')
        playerbar_middle_up_middle_copy.appendChild(box)
    });

    audio.addEventListener('pause', () => {
        console.log('b')
        playerbar_middle_up_middle_copy.innerHTML = ``
        const box = document.createElement('div')
        box.classList.add('playerbar_middle_up_middle_stopmask')
        playerbar_middle_up_middle_copy.appendChild(box)
    });

    audio.addEventListener('ended', () => {

    });
}

function stopAndplay() {
    playerbar_middle_up_middle_copy.addEventListener('click', function () {
        if (audio.paused) {
            // 如果音频暂停，播放音频
            audio.play();
        } else {
            // 如果音频正在播放，暂停音频
            audio.pause();
        }
    })
}
checkAudioPlaying()
stopAndplay()
