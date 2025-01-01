import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from "../src/contexts/UserContext";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
