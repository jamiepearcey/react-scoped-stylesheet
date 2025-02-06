import {scopeClass} from './some.scoped.css'

export default function SomeComponent() {
  return (
    <div data-test-id="component-root" className={scopeClass} >
      <div className="some-locally-scoped-class">Hello Scoped Styles</div>
      <div className="global-class">Hello Scoped Styles</div>
    </div>
  )
}
  