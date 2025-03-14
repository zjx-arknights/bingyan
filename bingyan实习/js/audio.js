const playerbar_middle_up_middle_copy = document.querySelector('.playerbar_middle_up_middle')
const playerbar_middle_down = document.querySelector('.playerbar_middle_down')

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
function updateLyrics(currentTime) {
    // 查找当前播放的歌词
    let lyric
    if (lyrics[currentLyricIndex]) {
        lyric = lyrics[currentLyricIndex]

        if (currentTime >= lyric.time) {
            // 将当前歌词加大并居中显示
            const lines = container.getElementsByClassName('lyric_line');
            for (let i = 0; i < lines.length; i++) {
                lines[i].classList.remove('lyric_now');
            }
            const currentLine = lines[currentLyricIndex];
            currentLine.classList.add('lyric_now');

            // 使用 scrollIntoView 实现平滑滚动
            currentLine.scrollIntoView({
                behavior: 'smooth', // 启用平滑滚动
                block: 'center'     // 居中对齐
            });

            // 下一句歌词
            currentLyricIndex++;

        }
    }
    console.log(currentLyricIndex)
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