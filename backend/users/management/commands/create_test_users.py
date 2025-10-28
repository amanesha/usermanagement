from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates test admin and regular users for development'

    def handle(self, *args, **kwargs):
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('[+] Admin user created'))
            self.stdout.write(self.style.WARNING('    Username: admin'))
            self.stdout.write(self.style.WARNING('    Password: admin123'))
        else:
            self.stdout.write(self.style.WARNING('[!] Admin user already exists'))

        # Create regular user
        if not User.objects.filter(username='user').exists():
            User.objects.create_user(
                username='user',
                email='user@example.com',
                password='user123',
                is_staff=False
            )
            self.stdout.write(self.style.SUCCESS('[+] Regular user created'))
            self.stdout.write(self.style.WARNING('    Username: user'))
            self.stdout.write(self.style.WARNING('    Password: user123'))
        else:
            self.stdout.write(self.style.WARNING('[!] Regular user already exists'))

        self.stdout.write(self.style.SUCCESS('\nTest users are ready!'))
