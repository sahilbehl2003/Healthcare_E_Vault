from django.urls import path
from chat.views import user_views as views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('patient/',views.create_patient, name='create-patient'),

    path('register/', views.registerUser, name='register'),

    path('profile/', views.getUserProfile, name='users-profile'),
    path('login-user/', views.login, name='login-user'),
    path('', views.getUsers, name='users'),
    path('doctors/', views.doctor_list, name="get-doctors"),
    path('appointments/', views.create_appointment, name="create-appointment"),

]