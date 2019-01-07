'use strict'
import { app, BrowserWindow } from 'electron'
/* eslint-disable no-console */
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

global.settings = require('standard-settings').getSettings()

var path = require('path')
var mkdirp = require('mkdirp')
let appStaticPath = path.join(app.getPath('documents'), app.getName())
console.log(appStaticPath)
mkdirp(appStaticPath)
var http = require('http')
var express = require('express')
var favicon = require('serve-favicon')
var logger = require('morgan')
var methodOverride = require('method-override')
var session = require('express-session')
var bodyParser = require('body-parser')
var Multer = require('multer')
// var upload = multer({ dest: appStaticPath })
var multipartUpload = Multer({
  storage: Multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, appStaticPath)
    },
    filename: (req, file, callback) => {
      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
  })
}).single('upload')

var errorHandler = require('errorhandler')
var expressApp = express()
expressApp.set('port', global.settings.server.port)
expressApp.set('views', path.join(__static, 'views'))
expressApp.set('view engine', 'pug')
expressApp.use(favicon(path.join(__static, '/public/favicon.ico')))
expressApp.use(logger('dev'))
expressApp.use(methodOverride())
expressApp.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' }))
expressApp.use(bodyParser.json())
expressApp.use(bodyParser.urlencoded({ extended: true }))

expressApp.use(express.static(path.join(__static, 'public')))
expressApp.use(express.static(appStaticPath))
expressApp.get('/', (req, res) => {
  res.send('hello world')
})
expressApp.get('/viewTest', function (req, res) {
  res.render('test', { title: 'Hey', message: 'Hello there!' })
})
expressApp.post('/fileUpload', multipartUpload, (req, res, next) => {
  console.log(req.body) // form fields
  console.log(req.files) // form files
  res.status(204).end()
})

// error handling middleware should be loaded after the loading the routes
if (expressApp.get('env') === 'development') {
  expressApp.use(errorHandler())
}

var server = http.createServer(expressApp)
server.listen(expressApp.get('port'), function () {
  console.log(`Express server listening on port: ${expressApp.get('port')}`)
})

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9081`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  if (!mainWindow) {
    console.info('🌱 - instantiate new window from createWindow function')
    let options = {
      height: 563,
      useContentSize: true,
      width: 1000
    }
    options = require('assignment')(options, global.settings.window)
    mainWindow = new BrowserWindow(options)
    if (global.settings.simulateOutage) {
      mainWindow.webContents.session.enableNetworkEmulation({offline: true})
    }
    if (global.settings.openDevTools) {
      mainWindow.webContents.openDevTools()
    }
    if (global.settings.clearCache) {
      console.warn('⚠️ - Option to clear cache set, cache will be cleared')
      mainWindow.webContents.session.clearStorageData({}, () => {
        mainWindow.webContents.session.clearCache(() => {
          console.log('cache cleared.')
          mainWindow.loadURL(winURL)
        })
      })
    } else {
      mainWindow.loadURL(winURL)
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
    mainWindow.on('unresponsive', () => {
      console.error('ERROR 61 - Window does not respond, let\'s quit')
      app.quit()
    })

    mainWindow.webContents.on('crashed', () => {
      console.error('ERROR 62 - Webcontent renderer crashed, let\'s quit')
      app.quit()
    })

    mainWindow.webContents.on('destroyed', () => {
      console.error('ERROR 63 - Webcontent destroyed, let\'s quit')
      app.quit()
    })
  } else {
    console.warn('⚠️ - trying to create a new Window from create window. Window already exist. Not creating')
  }
}
if (global.settings.appendSwitch) {
  Object.keys(global.settings.appendSwitch).forEach((key) => {
    if (global.settings.appendSwitch[key] !== '') {
      app.commandLine.appendSwitch(key, global.settings.appendSwitch[key])
    } else {
      app.commandLine.appendSwitch(key)
    }
  })
}
if (global.settings.appendArgument) {
  Object.values(global.settings.appendArgument).forEach((value) => {
    app.commandLine.appendArgument(value)
  })
}

app.on('ready', createWindow)

app.on('gpu-process-crashed', () => {
  console.error('ERROR 64 - App GPU process has crashed, let\'s quit')
  app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
process.on('uncaughtException', function (err) {
  console.error('Uncaugh exception: ' + err)
})
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
})
