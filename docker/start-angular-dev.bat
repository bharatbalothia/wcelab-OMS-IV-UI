@echo off

REM Get the Full path to the project (the directory above this)
for %%a in ("%%~dp0") do set "p_dir=%%~dpa%"
for %%a in (%p_dir:~0,-1%) do set "PROJECTDIR=%%~dpa"
echo PROJECTDIR is %PROJECTDIR%

REM create the syntax for docker to mount the project directory as /nodeapp
set "VOLMOUNT=%PROJECTDIR%:/nodeapp"

REM # Have to run as root for npm update :-(    --user $(id -u ${USER}):$(id -g ${USER})

REM # Run the docker with parent directory mounted as nodeapp. 
echo docker run -d -v %VOLMOUNT% --name appdev -p 24100:4200  angulardev /bin/sh -c "cd /nodeapp && npm install -d && ./start-poc.sh"
docker run -d -v %VOLMOUNT% --name appdev -p 24100:4200  angulardev /bin/sh -c "cd /nodeapp && npm install -d && ./start-poc.sh"
