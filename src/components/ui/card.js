export const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  )
}

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  )
}
