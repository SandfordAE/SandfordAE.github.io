# Python & Django Cheatsheet

## Project & App Management
- **Create New Django Project** (`django-admin startproject project_name .`): Initializes a new Django project structure in the current directory (`.`).
- **Create New Django App** (`python manage.py startapp app_name`): Generates a new modular application directory within the project.
- **Run Development Server** (`python manage.py runserver 8000`): Starts the built-in local development server on port 8000.

## Database & Migrations
- **Make Database Migrations** (`python manage.py makemigrations`): Inspects models and creates new migration files representing schema changes.
- **Apply Migrations** (`python manage.py migrate`): Applies pending migrations to sync the database schema.
- **Create Superuser** (`python manage.py createsuperuser`): Interactive prompt to create an administrator account for the Django admin panel.
