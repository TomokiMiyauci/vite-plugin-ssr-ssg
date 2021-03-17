import React, { FC } from 'react'
import './App.css'
import { Route, Switch, Link } from 'react-router-dom'
import { getRoutes } from 'vite-plugin-ssr-ssg/react'

const pages = import.meta.globEager('./pages/*.tsx')
const routes = getRoutes(pages)

const App: FC = () => {
  return (
    <div className="App">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        {routes.map(({ path, name, Component }) => {
          return (
            <Route exact path={path} key={name}>
              <Component />
            </Route>
          )
        })}
      </Switch>
    </div>
  )
}

export default App
