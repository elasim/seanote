# express-universal-react
This is boilerplate to develop Isomorphic ReactJS Web

It contains following features
- ES2015 with stage-0
- ExpressJS
- Development Server (browser-sync and hmr integrated)
- Build script for deploying or run your project

-----------------------------------------------------------
## Usage
```	
$ npm install
$ npm run build-tools
$ npm start
```

`npm start` is shorthand for `npm run server development`

that `development` parameter is name of build configure.

-----------------------------------------------------------
## Build Configure

In `development` configure,
- Generate source maps to debug your code
- Copy assets without changing filename

In `production` configure, 
- Generate minified codes using uglify plugin
- Copy assets as hash filename
>  Hash filename will be disabled with dev-server
  to reduce file creation

-----------------------------------------------------------
## Start with dev-server
When you edit your server source,
It will restart server itself to fast development.

Also, browser-sync and HMR script will be injected.
> bundle script file will not be created without NODE_ENV=production

```
$ npm run server <configure>
```

### Running dev-server with `NODE_ENV=production` with `production` configure
This is real production mode for dev-server

In this environment,
- Still, Server will be restarted when code changed.
- Browser-Sync and HMR disabled. Refreshing browser is your responsibility.
- Build process will copy assets as hash filename like production build.
> However, it will not delete old files.

-----------------------------------------------------------
## Build Project
Build result will be saved into ./build/`configure` directory.
> Before you run this command, delete that directory to build cleanly

```
$ npm run build <configure>
```

## Config Files
### ./src/config.json
This file contains binding informations for server.
> dev-server requires this file.

### ./tools/config.build.js
This file contains parameter for build to execute commands.

After change this file, you need to run `npm run build-tools` command.

> Also, probably you have to change server code to work properly

-----------------------------------------------------------
## Commands
```
$ npm start
$ npm run build-tools
$ npm run build <configure>
$ npm run server <configure>
```
