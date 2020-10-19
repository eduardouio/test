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
