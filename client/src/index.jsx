import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google"
import 'boxicons/css/boxicons.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='295099131481-l6mgeh805cerlvbav583lb8tuqm4trrb.apps.googleusercontent.com'>
   
      <App />

  </GoogleOAuthProvider>
) 