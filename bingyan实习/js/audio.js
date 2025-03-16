const playerbar_middle_up_middle_copy = document.querySelector('.playerbar_middle_up_middle')
const playerbar_middle_down = document.querySelector('.playerbar_middle_down')
const playerbar_middle_up_right = document.querySelector('.playerbar_middle_up_right')
const playerbar_middle_up_left = document.querySelector('.playerbar_middle_up_left')

// playerbar_middle_up_right.style.backgroundImage = `url${document.querySelector('.panel-content').children[audio.dataset.listlocation + 1].dataset.img}`
// playerbar_middle_up_left.style.backgroundImage = `url${document.querySelector('.panel-content').children[audio.dataset.listlocation + 1].dataset.img}`


function checkAudioPlaying() {
    // 判断 audio 元素是否正在播放
    audio.addEventListener('play', () => {
        // console.log('a')
        playerbar_middle_up_middle_copy.innerHTML = ``
        const box = document.createElement('div')
        box.classList.add('playerbar_middle_up_middle_startmask')
        playerbar_middle_up_middle_copy.appendChild(box)


    });

    audio.addEventListener('pause', () => {
        // console.log('b')
        playerbar_middle_up_middle_copy.innerHTML = ``
        const box = document.createElement('div')
        box.classList.add('playerbar_middle_up_middle_stopmask')
        playerbar_middle_up_middle_copy.appendChild(box)
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

// 格式化时间为 mm:ss 的格式
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsFormatted = Math.floor(seconds % 60);
    return minutes + ":" + (secondsFormatted < 10 ? "0" + secondsFormatted : secondsFormatted);
}

function updatatime() {
    audio.addEventListener('timeupdate', function () {
        let currentTime = audio.currentTime; // 当前播放时间
        let duration = audio.duration; // 总时长
        let currentFormatted = `0:00`
        let durationFormatted = `0:00`
        if (!isNaN(duration)) {
            currentFormatted = formatTime(currentTime); // 格式化已播放时间
            durationFormatted = formatTime(duration); // 格式化总时长
        }
        // 显示时长
        playerbar_middle_down.innerHTML = `${currentFormatted}/${durationFormatted}`;
    })
}

// 根据当前时间更新歌词
/**
 * 平滑滚动到指定位置
 * @param {HTMLElement} element - 需要滚动的容器
 * @param {number} targetScrollTop - 目标滚动位置
 * @param {number} duration - 滚动时间（固定时间，单位：毫秒）
 */
function smoothScrollTo(element, targetScrollTop, duration = 150) {
    const startScrollTop = element.scrollTop; // 当前滚动位置
    const distance = targetScrollTop - startScrollTop; // 滚动距离
    let startTime = null;

    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1); // 滚动进度（0 到 1）

        // 根据进度更新滚动位置
        element.scrollTop = startScrollTop + distance * progress;

        // 如果未完成滚动，继续动画
        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    // 启动滚动动画
    requestAnimationFrame(scrollAnimation);
}

/**
 * 平滑滚动到指定位置
 * @param {HTMLElement} element - 需要滚动的容器
 * @param {number} targetScrollTop - 目标滚动位置
 * @param {number} duration - 滚动时间（固定时间，单位：毫秒）
 */
function smoothScrollTo(element, targetScrollTop, duration = 150) {
    const startScrollTop = element.scrollTop; // 当前滚动位置
    const distance = targetScrollTop - startScrollTop; // 滚动距离
    let startTime = null;

    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1); // 滚动进度（0 到 1）

        // 根据进度更新滚动位置
        element.scrollTop = startScrollTop + distance * progress;

        // 如果未完成滚动，继续动画
        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    // 启动滚动动画
    requestAnimationFrame(scrollAnimation);
}

/**
 * 根据当前时间更新歌词
 * @param {number} currentTime - 当前播放时间
 */
function updateLyrics(currentTime) {
    if (lyrics[currentLyricIndex]) {
        const lyric = lyrics[currentLyricIndex];

        // 判断是否需要前进到下一句歌词
        if (currentTime >= lyric.time) {
            const lines = container.getElementsByClassName('lyric_line');
            for (let i = 0; i < lines.length; i++) {
                lines[i].classList.remove('lyric_now');
            }
            const currentLine = lines[currentLyricIndex];
            currentLine.classList.add('lyric_now');

            // 计算目标滚动位置
            const targetScrollTop = currentLine.offsetTop - container.clientHeight / 2;

            // 平滑滚动到目标位置
            smoothScrollTo(container, targetScrollTop);

            // 下一句歌词
            currentLyricIndex++;
        }
        // 判断是否需要回退到上一句歌词
        else if (currentLyricIndex > 0 && currentTime < lyrics[currentLyricIndex - 1].time) {
            currentLyricIndex--;

            const lines = container.getElementsByClassName('lyric_line');
            for (let i = 0; i < lines.length; i++) {
                lines[i].classList.remove('lyric_now');
            }
            const currentLine = lines[currentLyricIndex];
            currentLine.classList.add('lyric_now');

            // 计算目标滚动位置
            const targetScrollTop = currentLine.offsetTop - container.clientHeight / 2;

            // 平滑滚动到目标位置
            // console.log(container)
            // console.log(targetScrollTop)
            smoothScrollTo(container, targetScrollTop);
        }
    }
}




function simulatePlayback() {
    setInterval(() => {
        updateLyrics(audio.currentTime)
    }, 100);
}


simulatePlayback();


checkAudioPlaying()
stopAndplay()
setInterval(updatatime, 1000)



//音量
const sliderContainer = document.getElementById('sliderContainer');
const thumb = document.getElementById('thumb');
const fill = document.getElementById('fill');
let isDragging = false;

// 计算音量百分比（0-1）
function calculateVolume(clientX) {
    const rect = sliderContainer.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    return offsetX / rect.width;
}

// 更新界面显示
function updateVolume(volume) {
    const percentage = volume * 100 + '%';
    fill.style.width = percentage;
    thumb.style.left = percentage;
    console.log('当前音量:', volume.toFixed(2));
}

// 事件监听
thumb.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const volume = calculateVolume(e.clientX);
    updateVolume(volume);
});

sliderContainer.addEventListener('click', (e) => {
    const volume = calculateVolume(e.clientX);
    updateVolume(volume);
});

// 初始化音量
updateVolume(0.5);

//进度条
const progressContainer = document.getElementById('progressContainer');
const currentProgress = document.getElementById('currentProgress');
const progressHandle = document.getElementById('progressHandle');

let isDragging_ = false;

// 播放时间更新
audio.addEventListener('timeupdate', () => {
    if (!isDragging_) {
        const progress = (audio.currentTime / audio.duration) * 100;
        currentProgress.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
    }
});

// 点击进度条跳转
progressContainer.addEventListener('click', (e) => {
    if (!isDragging_) {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * audio.duration;
    }
});

// 拖动处理
progressHandle.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', handleDrag);
document.addEventListener('mouseup', endDrag);

function startDrag() {
    isDragging_ = true;
}

function handleDrag(e) {
    if (isDragging_) {
        const rect = progressContainer.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));

        currentProgress.style.width = `${pos * 100}%`;
        progressHandle.style.left = `${pos * 100}%`;
    }
}

function endDrag() {
    if (isDragging_) {
        isDragging_ = false;
        audio.currentTime = (parseFloat(currentProgress.style.width) / 100) * audio.duration;
    }
}


const cycleway_image = document.querySelector('.cycleway_image')
cycleway_image.dataset.playway = 'soft'
//三种播放模式
//模式切换
cycleway_image.addEventListener('click', () => {
    if (cycleway_image.dataset.playway === 'soft') {
        cycleway_image.dataset.playway = 'one'
        cycleway_image.style.backgroundImage = `url(svg/cycleway_image_one.svg)`
    }
    else if (cycleway_image.dataset.playway === 'one') {
        cycleway_image.dataset.playway = 'chaos'
        cycleway_image.style.backgroundImage = `url(svg/cycleway_image_chaos.svg)`
    }
    else {
        cycleway_image.dataset.playway = 'soft'
        cycleway_image.style.backgroundImage = `url(svg/cycleway_image_soft.svg)`
    }


})

function playway() {
    // 监听音频播放完毕事件

    audio.addEventListener('ended', function () {
        audio.dataset.listlocation = hadplaylist.findIndex((music) => music.hash === audio.dataset.hash)
        // console.log(audio.dataset.listlocation)

        if (cycleway_image.dataset.playway == 'soft') {
            console.log('1234')
            if (audio.dataset.listlocation == hadplaylist.length - 1) {
                audio.dataset.listlocation = 0
            }
            else {
                audio.dataset.listlocation++
            }
            playnextmusic(audio.dataset.listlocation)
            // console.log(audio.dataset.listlocation)
            //更新图片




        }
        else if (cycleway_image.dataset.playway == 'one') {
            playnextmusic(audio.dataset.listlocation)
        }
        else {
            let random_location = Math.floor(Math.random() * (hadplaylist.length))
            audio.dataset.listlocation = random_location
            playnextmusic(audio.dataset.listlocation)
        }
    });


}
playway()

function playnextmusic(musiclocation) {
    // console.log(musiclocation)
    const parent = document.querySelector('.panel-content');
    const child = parent.children[musiclocation];
    const next_hash = child.id
    const next_url = child.dataset.url
    const next_img = child.dataset.img
    const next_name = child.dataset.name
    const next_singername = child.dataset.singername



    //渲染
    playerbar_middle_up_middle.style.backgroundImage = `url(${next_img})`

    audio.src = next_url
    musicplaybox_left_image.style.backgroundImage = `url(${next_img})`
    musicplaybox.style.setProperty(
        '--dynamic-bg',
        `url(${next_img})`
    );
    musicplaybox_left_information_name.innerHTML = `${next_name}`
    musicplaybox_left_information_introduction.innerHTML = `歌手：${next_singername}`
    music_name.innerHTML = `${next_name}`
    music_synopsis.innerHTML = `歌手：${next_singername}`
    //寻找歌词
    searchlyric(next_hash)
    //将其数据存入正在播放
    playnow = {
        hash: next_hash,
        songname: next_name,
        singername: next_singername,
        imageurl: next_img,
        url: next_url,

    }

    // createmusiclist(next_name, next_singername, next_hash, next_url, next_img)

    //音频加上hash自定义标签
    audio.dataset.hash = next_hash
    updataimage()
}


//更新图片
function updataimage() {
    const listLocation = parseInt(audio.dataset.listlocation, 10)
    if (listLocation == 0) {
        playerbar_middle_up_left.style.backgroundImage = `url(${document.querySelector('.panel-content').children[hadplaylist.length - 1].dataset.img})`

        playerbar_middle_up_right.style.backgroundImage = `url(${document.querySelector('.panel-content').children[listLocation + 2].dataset.img})}`
    }
    else if (listLocation == hadplaylist.length - 1) {
        playerbar_middle_up_left.style.backgroundImage = `url(${document.querySelector('.panel-content').children[listLocation - 1].dataset.img})`

        playerbar_middle_up_right.style.backgroundImage = `url(${document.querySelector('.panel-content').children[0].dataset.img})`

    }
    else {
        console.log('123454')
        playerbar_middle_up_right.style.backgroundImage = `url(${document.querySelector('.panel-content').children[listLocation + 1].dataset.img})`
        playerbar_middle_up_left.style.backgroundImage = `url(${document.querySelector('.panel-content').children[listLocation - 1].dataset.img})`
    }

}

playerbar_middle_up_left.addEventListener('click', () => {
    audio.dataset.listlocation = hadplaylist.findIndex((music) => music.hash === audio.dataset.hash)
    if (cycleway_image.dataset.playway === 'soft') {
        if (audio.dataset.listlocation == 0) {
            audio.dataset.listlocation = hadplaylist.length - 1
        }
        else {

            audio.dataset.listlocation--
        }
        playnextmusic(audio.dataset.listlocation)
    }
})


playerbar_middle_up_right.addEventListener('click', () => {
    if (cycleway_image.dataset.playway === 'soft') {
        audio.currentTime = audio.duration
        audio.play()
    }
})
