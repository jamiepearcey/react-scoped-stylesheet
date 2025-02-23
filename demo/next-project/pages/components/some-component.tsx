import SomeNestedComponent from './some-nested-component'
import scopeRef from './some.scoped.css'

export function SomeComponent() {
  return (
    <div className={scopeRef}>
      <div className="global-class">Hello Scoped Styles</div>
      <div className="some-locally-scoped-class">Some nested class</div>
      <SomeNestedComponent/>

      <div className="target-deep-class">
        <SomeNestedComponent />
      </div>
    </div>
  )
}

export default SomeComponent;