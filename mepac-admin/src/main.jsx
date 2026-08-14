import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import App from './App.jsx'
import LoginPage from './views/LoginPage.jsx'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <Authenticated>
        <App />
      </Authenticated>
      <Unauthenticated>
        <LoginPage />
      </Unauthenticated>
    </ConvexAuthProvider>
  </React.StrictMode>,
)
