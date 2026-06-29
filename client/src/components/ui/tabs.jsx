import * as React from "react"

export function Tabs({ children, value, onValueChange }) {
  const [activeValue, setActiveValue] = React.useState(value || "")
  React.useEffect(() => {
    if (value) setActiveValue(value)
  }, [value])

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          value: activeValue,
          onValueChange: (val) => {
            setActiveValue(val)
            onValueChange?.(val)
          },
        })
      )}
    </div>
  )
}

export function TabsList({ children, className }) {
  return <div className={`flex space-x-2 ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, onValueChange }) {
  const handleClick = () => onValueChange?.(value)
  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {children}
    </button>
  )
}

export function TabsContent({ value: activeValue, value: contentValue, children }) {
  if (activeValue !== contentValue) return null
  return <div className="mt-4">{children}</div>
}
