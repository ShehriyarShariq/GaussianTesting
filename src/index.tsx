import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import NewThreeFiber from './NewThreeFiber.tsx'
// import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <NewThreeFiber />
    {/* <App /> */}
  </React.StrictMode>,
)
