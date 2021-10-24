#!/usr/bin/env bash
cd /home/ec2-user/viewflow-crece/creceEcuador/
source /home/ec2-user/viewflow-crece/env/bin/activate

/home/ec2-user/viewflow-crece/env/bin/python manage.py makemigrations
/home/ec2-user/viewflow-crece/env/bin/python manage.py migrate
/home/ec2-user/viewflow-crece/env/bin/python manage.py collectstatic 
