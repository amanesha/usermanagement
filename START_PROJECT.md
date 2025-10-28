# Quick Start Guide

## Step 1: Create the MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS usermanagment CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 2: Run Django Migrations

Open a terminal in the project root and run:

```bash
cd backend
python manage.py migrate
```

## Step 3: Create a Superuser (Optional but Recommended)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

## Step 4: Create Sample Departments

You can either:

### Option A: Through Django Shell
```bash
python manage.py shell
```

Then run:
```python
from users.models import Department

departments = [
    {'name': 'Engineering', 'description': 'Software development and IT'},
    {'name': 'Human Resources', 'description': 'Employee management and recruitment'},
    {'name': 'Marketing', 'description': 'Marketing and branding'},
    {'name': 'Sales', 'description': 'Sales and customer relations'},
    {'name': 'Finance', 'description': 'Financial planning and accounting'},
]

for dept in departments:
    Department.objects.create(**dept)

exit()
```

### Option B: Through Django Admin
1. Start the Django server (see Step 5)
2. Go to http://localhost:8000/admin/
3. Login with your superuser credentials
4. Add departments manually

## Step 5: Start the Backend Server

In the backend directory:

```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000

## Step 6: Start the Frontend

Open a NEW terminal window (keep the backend running) and run:

```bash
cd front-end
npm run dev
```

The frontend will be available at http://localhost:5173

## Step 7: Access the Application

Open your browser and go to:
**http://localhost:5173**

You should see the User Management System dashboard!

## Features You Can Now Use:

1. **Dashboard** (/) - View statistics and department breakdown
2. **Users List** (/users) - View all users, search, and filter
3. **Add User** (/users/add) - Create new users
4. **Edit User** (/users/edit/:id) - Update user information
5. **View Profile** (/users/:id) - See detailed user profile
6. **Delete User** - Click delete button in the users list

## Troubleshooting

### Database Connection Error
- Make sure MySQL is running
- Check the password in `backend/backend/settings.py` matches your MySQL root password
- Ensure the database `usermanagment` exists

### Frontend Not Loading
- Make sure you ran `npm install` in the front-end directory
- Check if port 5173 is available
- Clear browser cache

### CORS Errors
- Make sure the Django backend is running
- Check that CORS settings in `settings.py` include your frontend URL

### Module Not Found Errors
- Run `pip install -r requirements.txt` in the backend
- Run `npm install` in the front-end directory

## Next Steps

- Add more users through the frontend
- Explore the API at http://localhost:8000/api/
- Check the admin panel at http://localhost:8000/admin/
- Customize the styling and add more features!

Enjoy your User Management System!
