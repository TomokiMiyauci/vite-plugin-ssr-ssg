import React, { FC, Suspense } from 'react'
import './App.css'
import { Route, Switch, Link } from 'react-router-dom'
import { getRoutes } from 'vite-plugin-ssr-ssg/react'

const pages = import.meta.glob('./pages/*.tsx')
const routes = getRoutes(pages)

const App: FC = () => {
  return (
    <div className="App">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        {routes.map((route) => {
          return (
            <Route exact path={route.path} key={route.name}>
              {import.meta.env.SSR ? (
                <route.Component />
              ) : (
                <Suspense fallback={null}>
                  <route.Component />
                </Suspense>
              )}
            </Route>
          )
        })}
      </Switch>
    </div>
  )
}

export default App
