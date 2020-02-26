#!/bin/bash
cd /home/newapp/newappv2/
git pull origin master
npm install --save
npm run build
sudo kill -9 $(lsof -t -i:3000)
sudo systemctl start newapp-svelte
exit 0