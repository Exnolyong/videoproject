
$(function () {
    // 写入csrf
    $.getScript("/static/js/csrftoken.js");

    // 加载已有弹幕
    function loadDanmakus() {
        $.ajax({
            type: 'GET',
            url: danmakus_url,
            data: {
                video_id: video_id
            },
            dataType: 'json',
            success: function (data) {
                var code = data.code
                if (code == 0) {
                    var danmakus = data.data
                    for (var i = 0; i < danmakus.length; i++) {
                        showDanmaku(danmakus[i])
                    }
                }
            },
            error: function (xhr, type) {
                console.log("加载弹幕失败")
            }
        });
    }

    // 显示弹幕
    function showDanmaku(danmaku) {
        var danmakuContainer = $('.danmaku-container')
        var containerHeight = danmakuContainer.height()
        var containerWidth = danmakuContainer.width()
        var randomTop = Math.random() * (containerHeight - 30)
        var danmakuElement = $('<div class="danmaku"></div>')
        danmakuElement.text(danmaku.content)
        danmakuElement.css({
            'top': randomTop + 'px',
            'right': '-500px',
            'position': 'absolute',
            'color': getRandomColor(),
            'font-size': '14px',
            'white-space': 'nowrap',
            'z-index': 1000
        })
        danmakuContainer.append(danmakuElement)

        // 弹幕横向滚动动画
        danmakuElement.animate({
            'right': containerWidth + 'px'
        }, 10000, 'linear', function() {
            danmakuElement.remove()
        })
    }

    // 随机颜色生成函数
    function getRandomColor() {
        var colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#FFA500', '#800080', '#008000']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    // 提交弹幕
    var frm = $('#danmaku_form')
    frm.submit(function () {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            dataType: 'json',
            data: frm.serialize(),
            success: function (data) {
                var code = data.code
                var msg = data.msg
                if (code == 0) {
                    $('#danmaku_content').val("")
                    showDanmaku(data.data)
                } else {
                    alert(msg)
                }
            },
            error: function (data) {
                alert("弹幕发送失败")
            }
        });
        return false;
    });

    // 定时加载新弹幕
    setInterval(function () {
        loadDanmakus()
    }, 5000)

    // 初始加载弹幕
    loadDanmakus()
})
// 弹幕管理器
class DanmakuManager {
    constructor(container, video) {
        this.container = container;
        this.video = video;
        this.danmakus = []; // 存储所有弹幕
        this.currentDanmakus = []; // 存储当前正在显示的弹幕
        this.isPlaying = false; // 视频是否正在播放
        this.videoTime = 0; // 当前视频播放时间
        this.containerWidth = container.offsetWidth; // 弹幕容器宽度
        this.containerHeight = container.offsetHeight; // 弹幕容器高度
        this.fontSize = 20; // 弹幕字体大小
        this.speed = 3; // 弹幕移动速度（像素/毫秒）
        
        // 绑定事件
        this.bindEvents();
        // 加载弹幕
        this.loadDanmakus();
    }
    
    // 绑定事件
    bindEvents() {
        // 视频播放事件
        this.video.addEventListener('play', () => {
            this.isPlaying = true;
            this.animate();
        });
        
        // 视频暂停事件
        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        
        // 视频时间更新事件
        this.video.addEventListener('timeupdate', () => {
            this.videoTime = this.video.currentTime;
            this.showDanmakus();
        });
        
        // 窗口大小改变事件
        window.addEventListener('resize', () => {
            this.containerWidth = this.container.offsetWidth;
            this.containerHeight = this.container.offsetHeight;
        });
    }
    
    // 加载弹幕
    loadDanmakus() {
        $.ajax({
            url: get_danmakus_url,
            type: 'GET',
            data: {video_id: video_id},
            success: (response) => {
                if (response.code === 0) {
                    this.danmakus = response.data;
                    // 如果视频正在播放，显示弹幕
                    if (this.isPlaying) {
                        this.showDanmakus();
                    }
                }
            },
            error: (error) => {
                console.error('加载弹幕失败:', error);
            }
        });
    }
    
    // 显示弹幕
    showDanmakus() {
        // 过滤出当前时间应该显示的弹幕
        const newDanmakus = this.danmakus.filter(danmaku => {
            return danmaku.video_time <= this.videoTime && !danmaku.shown;
        });
        
        // 显示新的弹幕
        newDanmakus.forEach(danmaku => {
            this.createDanmaku(danmaku);
            danmaku.shown = true;
        });
    }
    
    // 创建弹幕元素
    createDanmaku(danmaku) {
        const danmakuElement = document.createElement('div');
        danmakuElement.className = 'danmaku';
        danmakuElement.textContent = danmaku.content;
        danmakuElement.style.color = danmaku.color;
        danmakuElement.style.fontSize = this.fontSize + 'px';
        danmakuElement.style.position = 'absolute';
        danmakuElement.style.whiteSpace = 'nowrap';
        danmakuElement.style.zIndex = '10';
        danmakuElement.style.opacity = '0.8';
        danmakuElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
        
        // 设置弹幕位置
        const position = this.getDanmakuPosition(danmaku.position);
        danmakuElement.style.top = position.top + 'px';
        danmakuElement.style.left = this.containerWidth + 'px';
        
        // 添加到容器
        this.container.appendChild(danmakuElement);
        
        // 存储弹幕元素
        danmaku.element = danmakuElement;
        this.currentDanmakus.push(danmaku);
    }
    
    // 获取弹幕位置
    getDanmakuPosition(positionType) {
        let top = 0;
        
        switch (positionType) {
            case 0: // 顶部
                top = Math.random() * (this.containerHeight / 3 - this.fontSize);
                break;
            case 1: // 中部
                top = Math.random() * (this.containerHeight / 3 - this.fontSize) + this.containerHeight / 3;
                break;
            case 2: // 底部
                top = Math.random() * (this.containerHeight / 3 - this.fontSize) + this.containerHeight * 2 / 3;
                break;
            default:
                top = Math.random() * (this.containerHeight - this.fontSize);
        }
        
        return {top: top};
    }
    
    // 动画循环
    animate() {
        if (!this.isPlaying) return;
        
        // 更新弹幕位置
        this.currentDanmakus.forEach((danmaku, index) => {
            if (danmaku.element) {
                const left = parseInt(danmaku.element.style.left);
                danmaku.element.style.left = (left - this.speed) + 'px';
                
                // 如果弹幕超出容器，移除
                if (left < -danmaku.element.offsetWidth) {
                    this.container.removeChild(danmaku.element);
                    this.currentDanmakus.splice(index, 1);
                }
            }
        });
        
        // 继续动画
        requestAnimationFrame(() => this.animate());
    }
    
    // 添加新弹幕
    addDanmaku(danmaku) {
        this.danmakus.push(danmaku);
        // 如果当前时间大于等于弹幕的显示时间，立即显示
        if (this.videoTime >= danmaku.video_time) {
            this.createDanmaku(danmaku);
            danmaku.shown = true;
        }
    }
}

// 发送弹幕
function sendDanmaku() {
    const content = $('#danmaku-content').val().trim();
    const position = parseInt($('#danmaku-position').val());
    const color = $('#danmaku-color').val();
    const videoTime = $('#video-player')[0].currentTime;
    
    // 验证输入
    if (!content) {
        alert('请输入弹幕内容');
        return;
    }
    
    // 发送请求
    $.ajax({
        url: submit_danmaku_url,
        type: 'POST',
        data: {
            content: content,
            video_time: videoTime,
            position: position,
            color: color,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: (response) => {
            if (response.code === 0) {
                // 清空输入框
                $('#danmaku-content').val('');
                // 添加到弹幕管理器
                danmakuManager.addDanmaku(response.data);
            } else {
                alert(response.msg);
            }
        },
        error: (error) => {
            console.error('发送弹幕失败:', error);
            alert('发送弹幕失败，请稍后重试');
        }
    });
}

// 初始化弹幕管理器
let danmakuManager;
$(document).ready(() => {
    const container = document.getElementById('danmaku-container');
    const video = document.getElementById('video-player');
    
    if (container && video) {
        danmakuManager = new DanmakuManager(container, video);
    }
    
    // 绑定发送按钮事件
    $('#send-danmaku').click(sendDanmaku);
    
    // 绑定回车键发送弹幕
    $('#danmaku-content').keypress((e) => {
        if (e.which === 13) {
            sendDanmaku();
        }
    });
});

