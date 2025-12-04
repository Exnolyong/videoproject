from django.urls import path

from . import views

app_name = 'comment'
urlpatterns = [
    path('submit_comment/<int:pk>', views.submit_comment, name='submit_comment'),
    path('get_comments/', views.get_comments, name='get_comments'),
    path('submit_danmaku/<int:pk>',views.submit_danmaku, name='submit_danmaku'),
    path('get_danmakus/', views.get_danmakus, name='get_danmakus'),
    path('submit_reply/<int:pk>',views.submit_reply, name='submit_reply'),
    path('submit_danmaku/<int:pk>', views.submit_danmaku, name='submit_danmaku'),
    path('get_danmakus/', views.get_danmakus, name='get_danmakus'),
    path('submit_reply/<int:pk>', views.submit_reply, name='submit_reply'),
    path('get_replies/', views.get_replies, name='get_replies'),
]