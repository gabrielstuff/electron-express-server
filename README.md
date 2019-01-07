# electron-express-server

> A simple Express server

### Server options

- Root
http://localhost:4545/

- viewTest
http://localhost:4545/viewTest

Serves a pug view with a form upload

You can check the `settings/settings.default.json` file to change the port where you want the express server to listen to.

By default the app, create a folder with the name `electron-express-server` in the `My Documents` folder of the user (depends on the OS you are running this app with). This allows the app to serves the file from this path and to permit file upload.

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/soixantecircuits/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://soixantecircuits.gitbooks.io/electron-vue/content/index.html).
