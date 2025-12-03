import os
import sys

# 设置Django项目的环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'videoproject.settings')

# 导入Django模块
import django
django.setup()

# 导入数据库连接
from django.db import connection

# 执行SQL语句，添加'parent_comment_id'字段到'v_comment'表
with connection.cursor() as cursor:
    cursor.execute("ALTER TABLE v_comment ADD COLUMN parent_comment_id INT(11) NULL DEFAULT NULL;")
    cursor.execute("ALTER TABLE v_comment ADD FOREIGN KEY (parent_comment_id) REFERENCES v_comment(id);")

# 执行SQL语句，创建'v_danmaku'表
with connection.cursor() as cursor:
    cursor.execute("CREATE TABLE v_danmaku (id INT(11) NOT NULL AUTO_INCREMENT, user_id INT(11) NOT NULL, nickname VARCHAR(30) NULL DEFAULT NULL, video_id INT(11) NOT NULL, content VARCHAR(50) NOT NULL, timestamp DATETIME NOT NULL, play_time FLOAT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES auth_user(id), FOREIGN KEY (video_id) REFERENCES v_video(id));")

print("数据库表结构更新成功！")