#!/bin/sh

NPM_BIN=$(npm bin)
npm run reset-db
npm run build

# clean up if needed
if [ -f test/server.pid ]; then
    kill `cat test/server.pid` 2> /dev/null
fi

# check if server is running
nc -z localhost 8080 &> /dev/null
if [ "$?" -eq "0" ]; then
    echo "ERROR: server is already running on port 8080. Shutdown server then re-run tests.\n"
    exit 1
fi

# start server
npm run start &
RESULT=$?
PID=$!
echo $PID > test/server.pid

# run tests
$NPM_BIN/mocha -r ts-node/register -r tsconfig-paths/register test/*.test.ts

# clean up
kill $PID
rm test/server.pid