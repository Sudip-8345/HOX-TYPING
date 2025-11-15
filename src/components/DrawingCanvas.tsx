import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Pen, 
  Eraser, 
  ArrowCounterClockwise,
  DotsNine,
  Pencil,
  LockOpen
} from '@phosphor-icons/react'

interface DrawingCanvasProps {
  onStrokeComplete: () => void
  isActive: boolean
  onActivate: () => void
}

type Tool = 'pen' | 'eraser' | 'highlighter'

export function DrawingCanvas({ onStrokeComplete, isActive, onActivate }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<Tool>('pen')
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setContext(ctx)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return
    if (!isActive) {
      onActivate()
    }

    setIsDrawing(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    let x, y
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    context.beginPath()
    context.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    let x, y
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    if (currentTool === 'pen') {
      context.strokeStyle = '#000000'
      context.lineWidth = 3
      context.lineCap = 'round'
      context.lineJoin = 'round'
    } else if (currentTool === 'eraser') {
      context.strokeStyle = '#f5f5f5'
      context.lineWidth = 20
      context.lineCap = 'round'
    } else if (currentTool === 'highlighter') {
      context.strokeStyle = 'rgba(34, 197, 94, 0.3)'
      context.lineWidth = 15
      context.lineCap = 'round'
    }

    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath()
      onStrokeComplete()
    }
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return
    context.fillStyle = '#f5f5f5'
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const undoLastStroke = () => {
    clearCanvas()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-border">
          <Button
            variant={currentTool === 'pen' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setCurrentTool('pen')}
            className="h-9 w-9"
          >
            <Pen size={18} weight="fill" />
          </Button>
          <Button
            variant={currentTool === 'highlighter' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setCurrentTool('highlighter')}
            className="h-9 w-9"
          >
            <Pencil size={18} weight="fill" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setCurrentTool('eraser')}
            className="h-9 w-9"
          >
            <Eraser size={18} weight="fill" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={undoLastStroke}
            className="h-9 w-9"
          >
            <ArrowCounterClockwise size={18} weight="bold" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <LockOpen size={18} weight="bold" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <DotsNine size={18} weight="bold" />
          </Button>
        </div>
      </div>

      <div className="relative bg-[#f5f5f5] rounded-xl border-2 border-border overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={cn(
            'w-full h-[400px] touch-none cursor-crosshair',
            !isActive && 'opacity-50'
          )}
        />
        
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-bold">
              O
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
