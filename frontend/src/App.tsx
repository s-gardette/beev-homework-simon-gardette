import { useState } from 'react'
import beevLogo from './assets/beev.svg'
import './App.css'
import { Button } from './components/ui/button'
import { increment } from './lib/increment'
import { NavLink } from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <a href="https://beev.co" target="_blank">
        <img src={beevLogo} className="logo w-16 h-16" alt="Beev logo" />
      </a>
      <h1 className='text-4xl font-bold'>Beev Homework</h1>
      <Button onClick={() => setCount((count) => increment(count))}>
        Click {count}
      </Button>
      <NavLink to="/version" className="underline hover:text-indigo-400">version</NavLink>
    </div>
  )
}

export default App
