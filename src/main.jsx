import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store.jsx'
import {Provider} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google'


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
