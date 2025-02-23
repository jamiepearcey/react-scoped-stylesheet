import { classNames } from '@/classnames';
import scopeRef from './some-nested.scoped.css'

export function SomeNestedComponent() {
  return (
    <div className={classNames(scopeRef, 'some-nested-class')}>
      I selectively pick up the scope of parent selectors
    </div>
  )
}

export default SomeNestedComponent;