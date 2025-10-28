from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DepartmentViewSet, PositionViewSet
from .auth_views import login, logout
from .admin_views import (
    change_password,
    list_admins,
    create_admin,
    delete_admin,
    list_positions,
    admin_change_user_password
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'positions-crud', PositionViewSet, basename='position')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/change-password/', change_password, name='change_password'),
    path('admins/', list_admins, name='list_admins'),
    path('admins/create/', create_admin, name='create_admin'),
    path('admins/<int:admin_id>/delete/', delete_admin, name='delete_admin'),
    path('admins/<int:user_id>/change-password/', admin_change_user_password, name='admin_change_user_password'),
    path('positions/', list_positions, name='list_positions'),
]
