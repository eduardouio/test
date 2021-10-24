#!/bin/bash
chown ec2-user:ec2-user /home/ec2-user/viewflow-crece
virtualenv /home/ec2-user/viewflow-crece/env
chown ec2-user:ec2-user /home/ec2-user/viewflow-crece/env
chown ec2-user:ec2-user /home/ec2-user/viewflow-crece/env/*
source /home/ec2-user/viewflow-crece/env/bin/activate
pip install -r /home/ec2-user/viewflow-crece/creceEcuador/requirements.txt

pip3 install gunicorn
pip3 install supervisor
