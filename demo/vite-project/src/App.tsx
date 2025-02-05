import './App.css'
import {scopeClass} from './some.scoped.css'

export default function App() {
  return (
    <div className={scopeClass}>
      <h1>Hello Scoped Styles</h1>
    </div>
  )
}
