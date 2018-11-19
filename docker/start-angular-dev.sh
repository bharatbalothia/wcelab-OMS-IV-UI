#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Get the parent directory as the mounting point
PROJECTDIR="$( readlink -f ${DIR}/../ )"

# Check if host is enfocing SELinux
SELINUXSTATUS=$(getenforce)

if [ "$SELINUXSTATUS" == "Enforcing" ]
then 
    # SELinux enforced. Need to use Z on the volume mount
    VOLMOUNT=${PROJECTDIR}:/nodeapp:Z
else
    # SELinux not enforced. Mount the volume as is
    VOLMOUNT=${PROJECTDIR}:/nodeapp
fi

# Have to run as root for npm update :-(    --user $(id -u ${USER}):$(id -g ${USER})

# Run the docker with parent directory mounted as nodeapp. 
echo "docker run -d -v ${VOLMOUNT} --name appdev -p 24100:4200  angulardev /bin/sh -c \"cd /nodeapp && npm install -d && ./start-poc.sh\""
docker run -d -v ${VOLMOUNT} --name appdev -p 24100:4200 angulardev /bin/sh -c "cd /nodeapp && npm install -d && ./start-poc.sh"
