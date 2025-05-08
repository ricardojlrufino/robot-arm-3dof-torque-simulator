import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoboticArmSimulator from './RoboticArmSimulator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoboticArmSimulator />
  </StrictMode>,
)
