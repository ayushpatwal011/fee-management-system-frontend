
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(

     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <BrowserRouter>
    <ToastContainer
  position="top-center"
  autoClose={2000}
  closeButton={false}
  theme="light"
  toastStyle={{
    backgroundColor: "black",
    color: "white",
    fontSize: "1rem",
    borderRadius: "0.3rem",
  }}
/>

    <App />
    </BrowserRouter>
     </ThemeProvider>

)
