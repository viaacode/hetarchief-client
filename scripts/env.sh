#!/bin/bash

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment
echo "window._ENV_ = {" >> ./env-config.js

# TODO get a list of env variables from the global .env file, so we don't need to maintain these in both locations
echo "  NODE_ENV: \"$NODE_ENV\"," >> ./env-config.js
echo "  PORT: \"$PORT\"," >> ./env-config.js
echo "  NEXT_PUBLIC_ORIGIN: \"$NEXT_PUBLIC_ORIGIN\"," >> ./env-config.js
echo "  NEXT_TELEMETRY_DISABLED: \"$NEXT_TELEMETRY_DISABLED\"," >> ./env-config.js
echo "  PROXY_URL: \"$PROXY_URL\"," >> ./env-config.js

echo "};" >> ./env-config.js
