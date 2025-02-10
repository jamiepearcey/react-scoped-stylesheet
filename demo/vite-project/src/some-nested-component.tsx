import scopeRef from './some-nested.scoped.css'

export default function SomeNestedComponent() {
  return (
    <div className="some-nested-class">
      I selectively pick up the scope of parent selectors
    </div>
  )
}