#!/usr/bin/env bash
cd /home/ec2-user/viewflow-crece/creceEcuador/
source /home/ec2-user/viewflow-crece/env/bin/activate
# supervisorctl -c /home/ec2-user/viewflow-crece/creceEcuador/supervisord.conf stop all 2&>1 >/dev/null
sudo pkill supervisord
