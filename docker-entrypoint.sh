#!/bin/bash
WD=/app
cd $WD
#echo "setting env"
#sh ./env.sh
#rm ./env.sh
#echo "this is docker entry"
/app/node_modules/.bin/next start
