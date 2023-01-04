import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FunctionComponent  } from 'react'
import Details from './components/Details'
import ErrorPage from './components/ErrorPage'

const App: FunctionComponent = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/:id" element={<Details />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

const container = document.getElementById('root')

if (!container) {
  throw new Error('no container to render to')
}

const root = createRoot(container)
root.render(<App />)
