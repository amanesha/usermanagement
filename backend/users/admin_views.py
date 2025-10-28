from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change password for authenticated user"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response(
            {'error': 'Please provide both old and new password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check old password
    if not user.check_password(old_password):
        return Response(
            {'error': 'Old password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate new password
    if len(new_password) < 6:
        return Response(
            {'error': 'New password must be at least 6 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Set new password
    user.set_password(new_password)
    user.save()

    # Keep user logged in after password change
    update_session_auth_hash(request, user)

    return Response({
        'success': True,
        'message': 'Password changed successfully'
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_admins(request):
    """List all admin users"""
    admins = User.objects.filter(is_staff=True).order_by('username')
    admin_list = [{
        'id': admin.id,
        'username': admin.username,
        'email': admin.email,
        'is_superuser': admin.is_superuser,
        'date_joined': admin.date_joined,
        'last_login': admin.last_login,
    } for admin in admins]

    return Response(admin_list)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_admin(request):
    """Create a new admin user"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    is_superuser = request.data.get('is_superuser', False)

    if not username or not email or not password:
        return Response(
            {'error': 'Please provide username, email, and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if username exists
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if email exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create admin user
    if is_superuser:
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
    else:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True
        )

    return Response({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_admin(request, admin_id):
    """Delete an admin user"""
    try:
        admin = User.objects.get(id=admin_id, is_staff=True)

        # Prevent deleting yourself
        if admin.id == request.user.id:
            return Response(
                {'error': 'You cannot delete your own account'},
                status=status.HTTP_400_BAD_REQUEST
            )

        admin.delete()
        return Response({
            'success': True,
            'message': 'Admin deleted successfully'
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'Admin not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_positions(request):
    """List all unique positions from users"""
    from .models import User as ProfileUser

    positions = ProfileUser.objects.exclude(
        position__isnull=True
    ).exclude(
        position__exact=''
    ).values_list('position', flat=True).distinct().order_by('position')

    return Response(list(positions))


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_change_user_password(request, user_id):
    """Admin can change any user's password"""
    try:
        user = User.objects.get(id=user_id)
        new_password = request.data.get('new_password')

        if not new_password:
            return Response(
                {'error': 'Please provide new password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 6:
            return Response(
                {'error': 'Password must be at least 6 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({
            'success': True,
            'message': f'Password changed for user {user.username}'
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
