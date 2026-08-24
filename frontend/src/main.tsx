import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './app'
import Present from './pages/Present'
import Profile from './pages/Profile'
import Discoveries from './pages/Discoveries'
import FutureSelf from './pages/FutureSelf'
import WhatIf from './components/WhatIf'
import Layout from './components/Layout'
import './index.css'

function WhatIfPage() {
  return (
    <div className="pt-8">
      <WhatIf />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/present" element={<Present />} />
          <Route path="/what-if" element={<WhatIfPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/discoveries" element={<Discoveries />} />
          <Route path="/self/:id" element={<FutureSelf />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
)
