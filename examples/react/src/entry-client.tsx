import React from 'react'
import { hydrate } from 'react-dom'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

hydrate(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
