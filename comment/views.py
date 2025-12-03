from datetime import datetime

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import *
from django.template.loader import render_to_string
from ratelimit.decorators import ratelimit

from video.forms import CommentForm
from video.models import Video
from comment.models import Danmaku


@ratelimit(key='ip', rate='2/m')
def submit_comment(request,pk):
    """
    每分钟限制发2条
    """
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        return JsonResponse({"code": 1, 'msg': '评论太频繁了，请1分钟后再试'})
        pass
    video = get_object_or_404(Video, pk = pk)
    form = CommentForm(data=request.POST)

    if form.is_valid():
        # print('success')
        new_comment = form.save(commit=False)
        new_comment.user = request.user
        new_comment.nickname = request.user.nickname
        new_comment.avatar = request.user.avatar
        new_comment.video = video
        
        # 处理父评论
        parent_comment_id = form.cleaned_data.get('parent_comment')
        if parent_comment_id:
            try:
                parent_comment = Comment.objects.get(id=parent_comment_id)
                new_comment.parent_comment = parent_comment
            except Comment.DoesNotExist:
                pass
        
        new_comment.save()

        data = dict()
        data['nickname'] = request.user.nickname
        data['avatar'] = request.user.avatar
        data['timestamp'] = datetime.fromtimestamp(datetime.now().timestamp())
        data['content'] = new_comment.content

        comments = list()
        comments.append(data)

        html = render_to_string(
            "comment/comment_single.html", {"comments": comments})

        return JsonResponse({"code":0,"html": html})
    return JsonResponse({"code":1,'msg':'评论失败!'})


def get_comments(request):
    if not request.is_ajax():
        return HttpResponseBadRequest()
    page = request.GET.get('page')
    page_size = request.GET.get('page_size')
    video_id = request.GET.get('video_id')
    video = get_object_or_404(Video, pk=video_id)
    comments = video.comment_set.filter(parent_comment__isnull=True).order_by('-timestamp').all()
    comment_count = len(comments)

    paginator = Paginator(comments, page_size)
    try:
        rows = paginator.page(page)
    except PageNotAnInteger:
        rows = paginator.page(1)
    except EmptyPage:
        rows = []

    if len(rows) > 0:
        code = 0
        html = render_to_string(
            "comment/comment_single.html", {"comments": rows})
    else:
        code = 1
        html = ""

    return JsonResponse({
        "code":code,
        "html": html,
        "comment_count": comment_count
    })


@ratelimit(key='ip', rate='5/m')
def submit_danmaku(request, pk):
    """
    提交弹幕，每分钟限制5条
    """
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        return JsonResponse({"code": 1, 'msg': '弹幕发送太频繁了，请1分钟后再试'})
    
    if not request.is_ajax():
        return HttpResponseBadRequest()
    
    video = get_object_or_404(Video, pk=pk)
    content = request.POST.get('content', '')
    play_time = request.POST.get('play_time', 0)
    
    if not content.strip():
        return JsonResponse({"code": 1, 'msg': '弹幕内容不能为空'})
    
    try:
        play_time = float(play_time)
    except ValueError:
        play_time = 0
    
    # 创建弹幕
    danmaku = Danmaku.objects.create(
        user=request.user,
        nickname=request.user.nickname,
        video=video,
        content=content.strip(),
        play_time=play_time
    )
    
    return JsonResponse({"code": 0, 'msg': '弹幕发送成功'})


def get_danmakus(request):
    """
    获取视频的所有弹幕
    """
    if not request.is_ajax():
        return HttpResponseBadRequest()
    
    video_id = request.GET.get('video_id')
    video = get_object_or_404(Video, pk=video_id)
    
    danmakus = video.danmaku_set.all().values('id', 'content', 'play_time', 'nickname')
    
    return JsonResponse({"code": 0, "danmakus": list(danmakus)})
