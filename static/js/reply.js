$(function () {
    // 写入csrf
    $.getScript("/static/js/csrftoken.js");

    // 显示回复表单
    $(document).on('click', '.reply-button', function () {
        var commentId = $(this).closest('.comment').attr('comment-id')
        var replyToNickname = $(this).data('reply-to')
        var replyToId = $(this).data('reply-to-id')
        var replyForm = $('<div class="reply-form"></div>')
        replyForm.html('<form class="ui reply form" id="reply_form_' + commentId + '" method="post" action="' + submit_reply_url + '/' + commentId + '">' +
            '<input type="hidden" name="reply_to_id" value="' + replyToId + '">' +
            '<div class="field">' +
            '<textarea placeholder="回复 ' + replyToNickname + '" name="content"></textarea>' +
            '</div>' +
            '<button class="ui primary button" type="submit">回复</button>' +
            '<button class="ui button cancel-reply" type="button">取消</button>' +
            '</form>')
        $(this).closest('.content').append(replyForm)
        replyForm.show()
    })

    // 取消回复表单
    $(document).on('click', '.cancel-reply', function () {
        $(this).closest('.reply-form').remove()
    })

    // 提交回复
    $(document).on('submit', 'form[id^="reply_form_"]', function () {
        var frm = $(this)
        var commentId = frm.attr('id').split('_')[2]
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            dataType: 'json',
            data: frm.serialize(),
            success: function (data) {
                var code = data.code
                var msg = data.msg
                if (code == 0) {
                    frm.closest('.reply-form').remove()
                    var replyList = frm.closest('.content').find('.reply-list')
                    if (replyList.length == 0) {
                        replyList = $('<div class="reply-list"></div>')
                        frm.closest('.content').append(replyList)
                    }
                    replyList.prepend(data.html)
                } else {
                    alert(msg)
                }
            },
            error: function (data) {
                alert("回复失败")
            }
        });
        return false;
    });

    // 加载已有回复
    function loadReplies(commentId) {
        $.ajax({
            type: 'GET',
            url: '/comment/get_replies/',
            data: {
                comment_id: commentId
            },
            dataType: 'json',
            success: function (data) {
                var code = data.code
                if (code == 0) {
                    var replies = data.data
                    var replyList = $('.comment[comment-id="' + commentId + '"]').find('.reply-list')
                    if (replyList.length == 0) {
                        replyList = $('<div class="reply-list"></div>')
                        $('.comment[comment-id="' + commentId + '"]').find('.content').append(replyList)
                    }
                    for (var i = 0; i < replies.length; i++) {
                        var replyHtml = renderReply(replies[i])
                        replyList.append(replyHtml)
                    }
                }
            },
            error: function (xhr, type) {
                console.log("加载回复失败")
            }
        });
    }

    // 渲染回复
    function renderReply(reply) {
        var replyHtml = '<div class="reply">'
        replyHtml += '<a class="avatar">'
        replyHtml += '<img class="ui avatar image" src="' + reply.avatar + '" onerror="this.src=\'/static/img/img_default_avatar.png\'">'
        replyHtml += '</a>'
        replyHtml += '<div class="content">'
        replyHtml += '<a class="author">' + reply.nickname + '</a>'
        if (reply.reply_to_nickname) {
            replyHtml += '<span class="reply-to">回复 ' + reply.reply_to_nickname + '</span>'
        }
        replyHtml += '<div class="metadata">'
        replyHtml += '<span class="date">' + reply.timestamp + '</span>'
        replyHtml += '</div>'
        replyHtml += '<div class="text">' + reply.content + '</div>'
        replyHtml += '<div class="actions">'
        replyHtml += '<a class="reply-button" data-reply-to="' + reply.nickname + '" data-reply-to-id="' + reply.user_id + '">回复</a>'
        replyHtml += '</div>'
        replyHtml += '</div>'
        replyHtml += '</div>'
        return replyHtml
    }

    // 当评论加载完成后加载回复
    $(document).on('DOMNodeInserted', '.comment', function () {
        var commentId = $(this).attr('comment-id')
        if (commentId) {
            loadReplies(commentId)
        }
    })
})
