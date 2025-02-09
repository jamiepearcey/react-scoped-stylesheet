export default function SomeNestedComponent() {
  return (
    <div>
      <div className="some-nested-class">I do not pick up the scope of parent selectors</div>
    </div>
  )
}