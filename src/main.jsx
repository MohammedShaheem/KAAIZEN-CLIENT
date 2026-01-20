import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store.jsx'
import {Provider} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <QueryClientProvider client = {queryClient}>
    <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
