import React from 'react'
import ReactDOM from 'react-dom/client'
import BasicTable from './components/BasicTable'
import './index.css'
import { createServer } from 'miragejs'

createServer({
  routes() {
    this.get('/api/orders', () => [
      { id: '1', name: 'Skyla Flynn', price: 15, invoice: true },
      { id: '2', name: 'Grayson Lara', price: 25, invoice: false },
      { id: '3', name: 'Kyleigh Henson', price: 13, invoice: true },
      { id: '4', name: 'Maleah Horn', price: 555, invoice: true },
      { id: '5', name: 'Gavin Tate', price: 78, invoice: false },
      { id: '6', name: 'Vera Howe', price: 1243, invoice: true },
      { id: '7', name: 'Tripp Hodges', price: 99, invoice: false },
      { id: '8', name: 'Sabrina Marshall',price: 1, invoice: true },
      { id: '9', name: 'Santino Romero',price: 44, invoice: false },
    ])
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BasicTable />
  </React.StrictMode>,
)
