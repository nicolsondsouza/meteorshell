#ssh root@128.199.196.222
#youiestwibing

echo $(pwd)

cd $home
cd HashRepublic
cd HashRepublic
cd meteor
cd ..

git pull -u origin master

cd meteor

MONGO_URL='mongodb://hashrepublic:123456@kahana.mongohq.com:10093/HashRepublic'
ROOT_URL='http://128.199.196.222:3000'
PORT=3000
METEOR_SETTINGS=$(cat /root/HashRepublic/HashRepublic/meteor/hashsettings.json)
MAIL_URL='smtp://postmaster%40sandbox77539.mailgun.org:2l9s4cmzqic2@smtp.mailgun.org:587'
APP_NAME="HashRepublic"

echo "bundling"

rm bundle.tar.gz



rm -r ../../appold
mkdir ../../appold
meteor bundle bundle.tar.gz
mv bundle.tar.gz ../../appold/bundle.tar.gz


echo "extracting"

#meteor bundle bundle.tar.gz

#mv bundle.tar.gz ../app/bundle.tar.gz

#meteor bundle ../app/bundle.tar.gz

echo "installing fibers"

cd ..
cd ..
cd appold
tar -xvzf bundle.tar.gz
echo $(pwd)

cd bundle/programs/server/node_modules
rm -Rf fibers
npm install fibers@1.0.0
cd ..
cd ..
cd ..

cd ..
cd ..

echo $(pwd)
pm2 stop ../app/main.js
#pm2 kill
rm -Rf app/
mv appold/ app
cd app/bundle/

echo "settings environment varaible"

export MONGO_URL=$MONGO_URL
export ROOT_URL=$ROOT_URL
export PORT=$PORT
export METEOR_SETTINGS="$METEOR_SETTINGS"
export MAIL_URL=$MAIL_URL

echo "starting app"

pm2 flush
pm2 start main.js

cd ..
cd ..
cd HashRepublic
cd meteor

