#!/bin/bash
WD=/app/public
cd $WD
echo "setting env"
sh ./env.sh
rm ./env.sh
/app/node_modules/.bin/next start
