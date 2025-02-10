import SomeNestedComponent from './some-nested-component'
import scopeRef from './some.scoped.css'

export default function SomeComponent() {
  return (
    <div data-test-id="component-root" style-scope={scopeRef}>
      <div className="global-class">Hello Scoped Styles</div>
      <div className="some-locally-scoped-class">Some nested class</div>
      <SomeNestedComponent/>
      <SomeNestedComponent style-propagate/>
    </div>
  )
}
  