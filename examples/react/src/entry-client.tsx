import React from 'react'
import { hydrate, render } from 'react-dom'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const getHydrateOrRender = (isSSR: string | boolean | undefined) =>
  isSSR ? hydrate : render

const renderFn = getHydrateOrRender(import.meta.env.SSR)
renderFn(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
