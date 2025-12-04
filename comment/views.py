from datetime import datetime

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import *
from django.template.loader import render_to_string
from ratelimit.decorators import ratelimit

from video.forms import CommentForm, DanmakuForm, ReplyForm
from video.models import Video
from comment.models import Comment


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
    comments = video.comment_set.order_by('-timestamp').all()
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
def submit_danmaku(request,pk):
    """
    每分钟限制发5条弹幕
    """
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        return JsonResponse({"code": 1, 'msg': '弹幕太频繁了，请1分钟后再试'})
        pass
    video = get_object_or_404(Video, pk = pk)
    form = DanmakuForm(data=request.POST)

    if form.is_valid():
        new_danmaku = form.save(commit=False)
        new_danmaku.user = request.user
        new_danmaku.nickname = request.user.nickname
        new_danmaku.avatar = request.user.avatar
        new_danmaku.video = video
        new_danmaku.save()

        data = dict()
        data['nickname'] = request.user.nickname
        data['avatar'] = request.user.avatar
        data['timestamp'] = datetime.fromtimestamp(datetime.now().timestamp())
        data['content'] = new_danmaku.content

        return JsonResponse({"code":0,"data": data})
    return JsonResponse({"code":1,'msg':'弹幕发送失败!'})


def get_danmakus(request):
    if not request.is_ajax():
        return HttpResponseBadRequest()
    video_id = request.GET.get('video_id')
    video = get_object_or_404(Video, pk=video_id)
    danmakus = video.danmaku_set.order_by('timestamp').all()

    data = []
    for danmaku in danmakus:
        item = dict()
        item['nickname'] = danmaku.nickname
        item['avatar'] = danmaku.avatar
        item['timestamp'] = danmaku.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        item['content'] = danmaku.content
        data.append(item)

    return JsonResponse({"code":0,"data": data})

@ratelimit(key='ip', rate='2/m')
def submit_reply(request,pk):
    """
    每分钟限制发2条回复
    """
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        return JsonResponse({"code": 1, 'msg': '回复太频繁了，请1分钟后再试'})
        pass
    comment = get_object_or_404(Comment, pk = pk)
    form = ReplyForm(data=request.POST)

    if form.is_valid():
        new_reply = form.save(commit=False)
        new_reply.user = request.user
        new_reply.nickname = request.user.nickname
        new_reply.avatar = request.user.avatar
        new_reply.comment = comment
        reply_to_id = request.POST.get('reply_to_id')
        if reply_to_id:
            from users.models import User
            reply_to = User.objects.get(id=reply_to_id)
            new_reply.reply_to = reply_to
            new_reply.reply_to_nickname = reply_to.nickname
        new_reply.save()

        data = dict()
        data['nickname'] = request.user.nickname
        data['avatar'] = request.user.avatar
        data['user_id'] = request.user.id
        data['timestamp'] = datetime.fromtimestamp(datetime.now().timestamp())
        data['content'] = new_reply.content
        data['reply_to_nickname'] = new_reply.reply_to_nickname

        html = render_to_string(
            "comment/reply_single.html", {"reply": data})

        return JsonResponse({"code":0,"html": html})
    return JsonResponse({"code":1,'msg':'回复失败!'})


def get_replies(request):
    if not request.is_ajax():
        return HttpResponseBadRequest()
    comment_id = request.GET.get('comment_id')
    comment = get_object_or_404(Comment, pk=comment_id)
    replies = comment.reply_set.order_by('-timestamp').all()

    data = []
    for reply in replies:
        item = dict()
        item['nickname'] = reply.nickname
        item['avatar'] = reply.avatar
        item['user_id'] = reply.user.id
        item['timestamp'] = reply.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        item['content'] = reply.content
        item['reply_to_nickname'] = reply.reply_to_nickname
        data.append(item)

    return JsonResponse({"code":0,"data": data})
