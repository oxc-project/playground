export const PLAYGROUND_DEMO_CODE = `
import React, { useEffect, useRef } from 'react'

const DummyComponent: React.FC = () => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.focus()
  }, [])

  return (
    <div>{Boolean(ref.current) ?? (
      <input type="text" ref={ref} />
    )}
    </div>
  )
}

export default DummyComponent
`.trim()
