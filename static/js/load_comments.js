
$(function(){
    // 页数
    var page = 0;
    // 每页展示15个
    var page_size = 15;

    // dropload
    $('.comments').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            page++;

            $.ajax({
                type: 'GET',
                url: comments_url,
                data:{
                     video_id: video_id,
                     page: page,
                     page_size: page_size
                },
                dataType: 'json',
                success: function(data){
                    var code = data.code
                    var count = data.comment_count
                    if(code == 0){
                        $('#id_comment_label').text(count + "条评论");
                        $('.comment-list').append(data.html);
                        // 绑定回复按钮事件
                        bindReplyEvents();
                        me.resetload();
                    }else{
                        me.lock();
                        me.noData();
                        me.resetload();
                    }
                },
                error: function(xhr, type){
                    me.resetload();
                }
            });
        }
    });
    
    // 绑定回复按钮事件
    function bindReplyEvents(){
        // 回复按钮点击事件
        $('.reply-btn').off('click').on('click', function(){
            const commentId = $(this).attr('comment-id');
            const replyFormContainer = $(`#comment-${commentId} .reply-form-container`);
            replyFormContainer.toggle();
            
            // 如果显示回复表单，加载已有回复
            if (replyFormContainer.is(':visible')) {
                loadReplies(commentId);
            }
        });
        
        // 取消回复按钮点击事件
        $('.cancel-reply-btn').off('click').on('click', function(){
            $(this).closest('.reply-form-container').hide();
        });
        
        // 回复表单提交事件
        $('.reply-form-container form').off('submit').on('submit', function(e){
            e.preventDefault();
            const commentId = $(this).attr('reply-to');
            const content = $(this).find('textarea').val().trim();
            
            if (!content) {
                alert('请输入回复内容');
                return;
            }
            
            // 发送回复请求
            $.ajax({
                url: submit_reply_url.replace('0', commentId),
                type: 'POST',
                data: {
                    content: content,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(response){
                    if (response.code === 0) {
                        // 清空回复表单
                        $(`#comment-${commentId} .reply-form-container textarea`).val('');
                        // 添加新回复到回复列表
                        addReplyToComment(commentId, response.data);
                    } else {
                        alert(response.msg);
                    }
                },
                error: function(error){
                    console.error('发送回复失败:', error);
                    alert('发送回复失败，请稍后重试');
                }
            });
        });
        
        // 查看更多回复按钮点击事件
        $('.show-replies-btn').off('click').on('click', function(){
            const commentId = $(this).attr('comment-id');
            loadReplies(commentId, true);
        });
    }
    
    // 加载回复
    function loadReplies(commentId, loadAll = false){
        $.ajax({
            url: get_replies_url,
            type: 'GET',
            data: {comment_id: commentId},
            success: function(response){
                if (response.code === 0) {
                    const replies = response.data;
                    const repliesList = $(`#comment-${commentId} .replies-list`);
                    const showRepliesBtn = $(`#comment-${commentId} .show-replies-btn`);
                    
                    // 清空回复列表
                    if (loadAll) {
                        repliesList.empty();
                    }
                    
                    // 添加回复到列表
                    replies.forEach(reply => {
                        addReplyToComment(commentId, reply);
                    });
                    
                    // 显示或隐藏查看更多回复按钮
                    if (replies.length > 5 && !loadAll) {
                        showRepliesBtn.show();
                    } else {
                        showRepliesBtn.hide();
                    }
                }
            },
            error: function(error){
                console.error('加载回复失败:', error);
            }
        });
    }
    
    // 添加回复到评论
    function addReplyToComment(commentId, reply){
        const repliesList = $(`#comment-${commentId} .replies-list`);
        const replyHtml = `
            <div class="comment" style="margin-left: 30px; margin-top: 5px;">
                <a class="avatar">
                    <img class="ui avatar image" src="${reply.avatar || '{% static 'img/img_default_avatar.png' %}'}">
                </a>
                <div class="content">
                    <a class="author">${reply.nickname || '匿名'}</a>
                    <div class="metadata">
                        <span class="date">${reply.timestamp}</span>
                    </div>
                    <div class="text">${reply.content}</div>
                    <div class="actions">
                        <a class="reply-btn" comment-id="${reply.id}">回复</a>
                    </div>
                </div>
            </div>
        `;
        repliesList.append(replyHtml);
        
        // 重新绑定回复按钮事件
        bindReplyEvents();
    }
    
    // 初始化绑定回复按钮事件
    bindReplyEvents();
});