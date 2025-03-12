const trigger = document.querySelector('.music_list_all_image');
const mask = document.querySelector('.mask');
const popupPanel = document.querySelector('.popup-panel');
let isOpen = false;

function togglePanel() {
    isOpen = !isOpen;

    // 切换类名
    mask.classList.toggle('active', isOpen);
    popupPanel.classList.toggle('active', isOpen);

    // 控制页面滚动
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

// 点击菜单触发
trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
});

// 点击遮罩层关闭
mask.addEventListener('click', (e) => {
    if (isOpen) togglePanel();
});

// 阻止面板内部点击关闭
popupPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ESC键关闭支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
        togglePanel();
    }
});