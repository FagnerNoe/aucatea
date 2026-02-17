import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { AuthProvider } from './context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { StyleProvider } from './context/StyleContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StyleProvider>

  </StrictMode>,
)
