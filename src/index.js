import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import AppNew from './AppNew'
import ThreeApp from './ThreeApp'
import NewThreeJsImpl from './NewThreeJsImpl'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/old" element={<App />} />
        <Route path="/" element={<AppNew />} />
      </Routes>
      {/* <ThreeApp /> */}
      {/* <NewThreeJsImpl /> */}
    </BrowserRouter>
  </React.StrictMode>,
)
