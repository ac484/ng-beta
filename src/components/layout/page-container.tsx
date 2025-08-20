import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function PageContainer({
  children,
  className,
  title,
  description,
  actions,
}: PageContainerProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}