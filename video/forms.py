from django import forms
from comment.models import Comment, Danmaku, Reply

class CommentForm(forms.ModelForm):
    content = forms.CharField(error_messages={'required': '不能为空',},
        widget=forms.Textarea(attrs = {'placeholder': '请输入评论内容' })
    )

    class Meta:
        model = Comment
        fields = ['content']

class DanmakuForm(forms.ModelForm):
    content = forms.CharField(error_messages={'required': '不能为空',},
        widget=forms.TextInput(attrs = {'placeholder': '请输入弹幕内容' })
    )

    class Meta:
        model = Danmaku
        fields = ['content']

class ReplyForm(forms.ModelForm):
    content = forms.CharField(error_messages={'required': '不能为空',},
        widget=forms.Textarea(attrs = {'placeholder': '请输入回复内容' })
    )

    class Meta:
        model = Reply
        fields = ['content']

