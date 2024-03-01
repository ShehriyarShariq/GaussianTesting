import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import ThreeApp from './ThreeApp'
import NewThreeJsImpl from './NewThreeJsImpl'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
    {/* <ThreeApp /> */}
    {/* <NewThreeJsImpl /> */}
  </React.StrictMode>,
)
