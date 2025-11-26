import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'


const App = () => {
  return (
    <div >
      <Routes>
      <Route path={'/'} element={<Onboarding />}/>
      <Route path={'/home'} element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App

