# Run on Docker

You can run this project on an angular node server (*ng*). Or you can keep your laptop clean and run the development as a docker container. 

To run docker, you run the following instruction on Linux, Mac, or Windows 10 with [Docker for Windows](https://docs.docker.com/docker-for-windows/install/). If you are brave and use Windows 10, you can also try the experimental Docker on Windows Subsystem for Linux following [my gist here](https://gist.github.com/nedzhang/58490417387bc25b80d62d28c54617a3).

## Build the Angular 

We need to build an image that include node server and Angular Cli. You can build that with ```./build-appdev-image.sh```

## Run the Angular development container

You can use ```./start-angular-dev.sh``` script to start a docker comtainer that mounts the current directory as the nodeapp directory. This start application on http://localhost:24100. The server takes some time to start the first time due to npm dependency installation. After that, the server starts quickly.

## Development

You can change the files in the project directory (the parent folder). The node server detects the change automatically and recompile the web application. You don't need to stop or restart the container to pick up changes. 

## What to do if I see a big error message and my node container won't start?

If you see a message like

```console
/usr/bin/docker-current: Error response from daemon: Conflict. The name "/appdev" is already in use by container 0b13f8220501f538b8b4c737da43SOMETHINGSOMETHINGSOMETHING. You have to remove (or rename) that container to be able to reuse that name..
See '/usr/bin/docker-current run --help'.
```

that means that you have a hanging node server container. You can just remove it. try ```docker rm appdev``` then use ```./start-angular-dev.sh``` again.
