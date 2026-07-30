import './App.css'

import { Button } from "@/components/ui/button"
function App() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-white">
      <h1 className="text-3xl font-bold">Shadcn UI + React Works! 🚀</h1>
      <Button variant="default">Click Me</Button>
    </div>
  )
}

export default App
