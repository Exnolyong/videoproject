from django import forms
from comment.models import Comment

class CommentForm(forms.ModelForm):
    content = forms.CharField(error_messages={'required': '不能为空',},
        widget=forms.Textarea(attrs = {'placeholder': '请输入评论内容' })
    )
    parent_comment = forms.IntegerField(required=False, widget=forms.HiddenInput())

    class Meta:
        model = Comment
        fields = ['content', 'parent_comment']

