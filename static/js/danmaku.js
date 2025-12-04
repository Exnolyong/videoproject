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
