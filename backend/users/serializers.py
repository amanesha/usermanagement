from rest_framework import serializers
from .models import User, Department, Position


class DepartmentSerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'user_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_user_count(self, obj):
        return obj.users.count()


class UserListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'department', 'department_name', 'position', 'status', 'created_at'
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'date_of_birth', 'gender', 'address', 'city', 'state', 'country',
            'postal_code', 'department', 'department_name', 'position',
            'employee_id', 'hire_date', 'salary', 'status', 'profile_picture',
            'bio', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'gender', 'address', 'city', 'state', 'country',
            'postal_code', 'department', 'position', 'employee_id', 'hire_date',
            'salary', 'status', 'profile_picture', 'bio'
        ]

    def validate_email(self, value):
        if self.instance and self.instance.email == value:
            return value
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_employee_id(self, value):
        if not value:
            return value
        if self.instance and self.instance.employee_id == value:
            return value
        if User.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("A user with this employee ID already exists.")
        return value


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
