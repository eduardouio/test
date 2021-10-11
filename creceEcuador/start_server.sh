#!/bin/bash
cd /home/ec2-user/viewflow-crece/creceEcuador/
source env/bin/activate
supervisord -c supervisord.conf
