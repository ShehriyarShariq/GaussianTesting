import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import AppNew from './AppNew'
import NewThreeJsImpl from './NewThreeJsImpl'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppNew />} />
        <Route path="/three" element={<NewThreeJsImpl />} />
      </Routes>
      {/* <ThreeApp /> */}
    </BrowserRouter>
  </React.StrictMode>,
)
