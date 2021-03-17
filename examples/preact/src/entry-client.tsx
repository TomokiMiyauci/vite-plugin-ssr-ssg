import { hydrate } from 'preact'
import { App } from './app'
import './index.css'

hydrate(<App />, document.getElementById('app')!)
