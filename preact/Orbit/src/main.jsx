import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      registration => {
        console.log('✅ PWA Service Worker registered:', registration)
      },
      error => {
        console.log('❌ Service Worker registration failed:', error)
      }
    )
  })
}

render(<App />, document.getElementById('app'))
