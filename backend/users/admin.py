from django.contrib import admin
from .models import User, Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'first_name', 'last_name', 'email', 'department', 'position', 'status']
    list_filter = ['status', 'department', 'gender']
    search_fields = ['first_name', 'last_name', 'email', 'employee_id']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Profile Information', {
            'fields': ('date_of_birth', 'gender', 'address', 'city', 'state', 'country', 'postal_code', 'profile_picture', 'bio')
        }),
        ('Professional Information', {
            'fields': ('department', 'position', 'employee_id', 'hire_date', 'salary', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
