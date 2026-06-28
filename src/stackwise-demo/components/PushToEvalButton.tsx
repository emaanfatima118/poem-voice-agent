import { Button } from '@/stackwise-demo/components/ui/button'
import { Target } from 'lucide-react'

interface PushToEvalButtonProps {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  moduleColor?: string
  disabled?: boolean
  onClick?: () => void
}

export function PushToEvalButton({ 
  size = 'sm', 
  variant = 'outline',
  className = '',
  moduleColor,
  disabled = false,
  onClick
}: PushToEvalButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // TODO: Implement actual push to eval matrix functionality
      console.log('Pushed to Eval Matrix')
    }
  }

  const customStyle: React.CSSProperties = moduleColor ? {
    borderColor: moduleColor,
    color: moduleColor
  } : {}

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      className={className}
      style={customStyle}
      disabled={disabled}
      data-testid="button-push-to-eval"
    >
      <Target className="w-3 h-3 mr-1" style={moduleColor ? { color: moduleColor } : undefined} />
      +Eval
    </Button>
  )
}
