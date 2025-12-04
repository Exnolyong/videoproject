
### 项目名称

基于python的视频点播网站开发（课程作业）

### 项目介绍

一个视频点播网站，因为笔者非常喜欢观看视频，尤其是YouTube、bilibili都是笔者非常喜欢的视频网站，所以想自己实现一个简单的视频点播网站，作为大三期末课程作品。学以致用。

### 项目功能
本项目分为前台和后台

前台功能
- 视频列表展示
- 视频播放详情
- 详情评论
- 个人中心

后台功能
- 视频管理
- 评论管理
- 用户管理
- 反馈管理


**首页展示**

![](https://github.com/geeeeeeeek/videoproject/blob/master/static/img/demo01.png)


**详情页**

![](https://github.com/geeeeeeeek/videoproject/blob/master/static/img/demo02.png)


**后台首页**

![](https://github.com/geeeeeeeek/videoproject/blob/master/static/img/demo03.png)


**视频管理**

![](https://github.com/geeeeeeeek/videoproject/blob/master/static/img/demo04.png)


### 适合人群

python初级学员、大学生、系统设计人员、面试作品

### 技术栈
python/django/nginx/mysql/semantic-css/jquery/html

### 源码
[https://github.com/geeeeeeeek/videoproject/](https://github.com/geeeeeeeek/videoproject/)

### 安装依赖库

pip install -r requirement.txt

### 运行项目

运行 python manage.py runserver 即可

 

### 付费咨询

微信: lengqin1024


### 参考资料

- [m3u8 player](https://m3u8player.org/en/)

- [open m3u8 file](https://m3u8player.org/en/)

- [cnblogs](http://cnblogs.com)





### 附加的内容

1.视频附带弹幕功能，用户可以在任意视频内写入任意内容，确定写入后该评论会在确定写入的时间段以横向滚动的方式展现，弹幕容量不得超过当前视频大小（前台功能）
2.视频附带弹幕功能管理，管理员在拥有普通用户拥有的功能基础上，对用户实行基本的增删查功能（后台功能）
3.评论区新增楼中楼功能，用户可以在任意评论区的评论中回复某个人的回复，亦可回复某个人的回复（前台功能）
4.评论管理新增楼中楼功能，管理员在拥有普通用户拥有的功能基础上，对用户实行基本的增删查功能（后台功能）