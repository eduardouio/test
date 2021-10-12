#!/bin/bash
sudo pip3 install virtualenv
cd /home/ec2-user/viewflow-crece/creceEcuador
virtualenv env
source env/bin/activate
sudo pip3 install -r requirements.txt
pip3 install gunicorn
