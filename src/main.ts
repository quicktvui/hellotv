//--------------------router-----------------------
import { createESRouter, Router } from '@extscreen/es3-router'
import routes from './routes'
//--------------------ESApp-----------------------
import application from './App.vue'
import { ESApp } from '@extscreen/es3-vue'
import { createESApp } from '@extscreen/es3-core'
import { ESComponent } from '@extscreen/es3-component'
import { MYComponent } from './components/qt-ul-component'
import { MYTABSComponent } from './components/qt-tabs-component'

//--------------------components-----------------------
const routerOptions = {
  main: 'filter',
  error: 'error',
  limit: 5,
  routes: routes
}
const router: Router = createESRouter(routerOptions)
const app: ESApp = createESApp(application, router)

app.use(ESComponent)
app.use(MYComponent)
app.use(MYTABSComponent)

const player = createESPlayer()
app.use(player)

const playerManager = createESPlayerManager()
app.use(playerManager)

const videoPlayer = createESVideoPlayer()
app.use(videoPlayer)

const ADPlayer = createESADPlayer()
app.use(ADPlayer)

//---------------------------QuickTVUI----------------------------------
import '@quicktvui/quicktvui3/dist/index.css'
import { QuickTVUI } from '@quicktvui/quicktvui3'
import { createESPlayer } from '@extscreen/es3-player'
import { createESPlayerManager } from '@extscreen/es3-player-manager'
import { createESVideoPlayer } from '@extscreen/es3-video-player'
import { createESADPlayer } from '@extscreen/es3-ad-player'
app.use(QuickTVUI)
