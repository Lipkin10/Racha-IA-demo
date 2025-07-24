import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

interface SelectValueProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}>({})

const Select = ({ value, onValueChange, disabled, children }: SelectProps) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { disabled } = React.useContext(SelectContext)
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = React.forwardRef<HTMLDivElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const { value } = React.useContext(SelectContext)
    return (
      <div
        ref={ref}
        className={cn('flex-1 text-left', className)}
        {...props}
      >
        {value || placeholder}
      </div>
    )
  }
)
SelectValue.displayName = 'SelectValue'

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { onValueChange } = React.useContext(SelectContext)
    
    const handleClick = () => {
      onValueChange?.(value)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } 