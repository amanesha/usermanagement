from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import User, Department, Position
from .serializers import (
    UserListSerializer,
    UserDetailSerializer,
    UserCreateUpdateSerializer,
    DepartmentSerializer,
    PositionSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        departments = Department.objects.annotate(
            total_users=Count('users'),
            active_users=Count('users', filter=Q(users__status='active')),
            inactive_users=Count('users', filter=Q(users__status='inactive')),
            on_leave_users=Count('users', filter=Q(users__status='on_leave'))
        )

        stats_data = []
        for dept in departments:
            stats_data.append({
                'id': dept.id,
                'name': dept.name,
                'total_users': dept.total_users,
                'active_users': dept.active_users,
                'inactive_users': dept.inactive_users,
                'on_leave_users': dept.on_leave_users
            })

        return Response(stats_data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('department').all()

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserDetailSerializer

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(status='active').count()
        inactive_users = User.objects.filter(status='inactive').count()
        on_leave_users = User.objects.filter(status='on_leave').count()

        dept_stats = Department.objects.annotate(
            user_count=Count('users')
        ).values('id', 'name', 'user_count')

        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'on_leave_users': on_leave_users,
            'department_breakdown': list(dept_stats)
        })

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        user = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['active', 'inactive', 'on_leave']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.status = new_status
        user.save()

        serializer = self.get_serializer(user)
        return Response(serializer.data)


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
