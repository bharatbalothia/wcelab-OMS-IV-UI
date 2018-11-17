# Run on Docker

You can run this project on an angular node server (~ng~). Or you can keep your laptop clean and run the development as a docker container. 

## Build the Angular 

We need to build an image that include node server and Angular Cli. You can build that use the ```./build-appdev-image.sh```

## Run the Angular development container

You can use the ```./start-angular-dev.sh``` script to start a docker comtainer that mounts the current directory as the nodeapp directory.

