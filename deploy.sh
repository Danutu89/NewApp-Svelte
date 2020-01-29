#!/usr/bin/expect -f
cd /home/newapp/newappv2
git pull
sudo kill -9 $(lsof -t -i:3000)
npm run build
nohup npm run start