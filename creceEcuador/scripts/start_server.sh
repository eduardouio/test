#!/bin/bash
cd /home/ec2-user/viewflow-crece/creceEcuador/
source /home/ec2-user/viewflow-crece/env/bin/activate
supervisord -c supervisord.conf
