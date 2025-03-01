import SomeNestedComponent from './some-nested-component'
import scopeRef from './some.scoped.css'

export function SomeComponent() {
  return <div data-test-id="component-root" className={`${scopeRef} component-demo`}>
    <div className="component-panel"><h3>Parent component</h3><p>Local styles stay local.</p><span className="scope-note">.component-panel</span></div>
    <div className="component-panel"><h3>Nested component</h3><p>Reach deeper with <code>:deep()</code>.</p><div className="nested-sample"><span className="sample-label">default</span><SomeNestedComponent /></div><div className="nested-sample deep-sample"><span className="sample-label">:deep()</span><SomeNestedComponent /></div></div>
  </div>
}
export default SomeComponent
