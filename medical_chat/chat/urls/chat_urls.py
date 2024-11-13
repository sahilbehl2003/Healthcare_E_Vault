from django.urls import path
from chat.views import chat_views as views

urlpatterns = [
   #path('', views.ChatView.as_view(), name='chat'),
    path('search/', views.search, name='chat'),
    path('chat-with-db/', views.chat_with_db, name='chat_with_db'),


    #path('', views.index, name='index'),
]
