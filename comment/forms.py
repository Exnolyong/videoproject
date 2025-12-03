from django import forms
from comment.models import Danmaku

class DanmakuForm(forms.ModelForm):
    content = forms.CharField(error_messages={'required': '不能为空',},
        widget=forms.TextInput(attrs = {'placeholder': '发送弹幕', 'maxlength': '100'})
    )
    video_time = forms.FloatField(error_messages={'required': '请选择弹幕显示时间',})
    position = forms.IntegerField(error_messages={'required': '请选择弹幕位置',}, initial=1)
    color = forms.CharField(error_messages={'required': '请选择弹幕颜色',}, initial='#FFFFFF')

    class Meta:
        model = Danmaku
        fields = ['content', 'video_time', 'position', 'color']
