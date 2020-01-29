#!/bin/bash
cd /home/newapp/newappv2/
git pull origin master
sudo kill -9 $(lsof -t -i:3000)
npm install --save
npm run build
nohup npm run start &
exit 0