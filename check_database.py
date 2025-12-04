import os
import sys

# 设置Django项目的环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'videoproject.settings')

# 导入Django模块
import django
django.setup()

# 导入数据库连接
from django.db import connection

# 检查v_comment表中的id字段类型
with connection.cursor() as cursor:
    cursor.execute("DESCRIBE v_comment;")
    columns = cursor.fetchall()
    print("v_comment表中的字段：")
    for column in columns:
        print(column)

# 检查auth_user表中的id字段类型
with connection.cursor() as cursor:
    cursor.execute("DESCRIBE auth_user;")
    columns = cursor.fetchall()
    print("\nauth_user表中的字段：")
    for column in columns:
        print(column)

# 检查v_video表中的id字段类型
with connection.cursor() as cursor:
    cursor.execute("DESCRIBE v_video;")
    columns = cursor.fetchall()
    print("\nv_video表中的字段：")
    for column in columns:
        print(column)