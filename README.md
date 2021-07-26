# Django - commands

## Installing packages
```
pip install -r requirements.txt
```
## Adding packages
```
pip install PACKAGE
pip freeze > requirements.txt
```

## Create migrations for the plataforma app.

```
python manage.py makemigrations `nombreModelo`
python manage.py migrate `nombreModelo`
```

## Create an admin user to initial login
```
python manage.py createsuperuser
```

## Run the server
```
python manage.py runserver
```

Go to http://127.0.0.1:8000 and see the action!


## How to generate state diagram FSM
```
python manage.py graph_transitions > transitions.dot
```

After that copy the text generated inside transitions.dot and paste it here
http://www.webgraphviz.com/

## How to load answer options in survey questions
```
python manage.py loaddata vanilla_seed.json
```

## Mail Configuration

In order to register or register an application you must configure the email in the application.
-In the route **creceEcuador/creceEcuador** in the **settings.py** file, configure the following:

```
#Email
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_PORT = 587
```

Note: The **EMAIL_HOST_USER** is the email necessary to send an email to the user to activate their account.


## configure pre-approved temporary requests
```
python manage.py loaddata preaprobados_seed.json
``` 
