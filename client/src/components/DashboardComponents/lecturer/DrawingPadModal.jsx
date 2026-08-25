import { useEffect, useRef, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eraser, Pen, Undo2, Trash2 } from "lucide-react"

const PAD_COLORS = ["#111827", "#dc2626", "#2563eb", "#16a34a"]
const PAD_WIDTHS = [2, 4, 8]
const CANVAS_W = 640
const CANVAS_H = 420

// Simple drawing pad: pen / eraser / colors / widths / undo / redo / clear.
// Exports a flattened white-background PNG dataURL (downscaled to <= 1000px).
export default function DrawingPadModal({ open, onOpenChange, onInsert }) {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState("pen") // 'pen' | 'eraser'
  const [color, setColor] = useState(PAD_COLORS[0])
  const [lineWidth, setLineWidth] = useState(PAD_WIDTHS[1])
  const strokesRef = useRef([])       // [{ points:[{x,y}], color, width, erase }]
  const redoStackRef = useRef([])
  const drawingRef = useRef(false)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    for (const s of strokesRef.current) {
      if (s.points.length === 0) continue
      ctx.save()
      ctx.globalCompositeOperation = s.erase ? "destination-out" : "source-over"
      ctx.strokeStyle = s.color
      ctx.lineWidth = s.width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(s.points[0].x, s.points[0].y)
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y)
      ctx.stroke()
      ctx.restore()
    }
  }, [])

  // Reset the pad each time it opens
  useEffect(() => {
    if (open) {
      strokesRef.current = []
      redoStackRef.current = []
      setTool("pen")
      setColor(PAD_COLORS[0])
      setLineWidth(PAD_WIDTHS[1])
      requestAnimationFrame(() => redraw())
    }
  }, [open, redraw])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    drawingRef.current = true
    redoStackRef.current = []
    strokesRef.current.push({
      points: [getPos(e)],
      color,
      width: tool === "eraser" ? lineWidth * 4 : lineWidth,
      erase: tool === "eraser",
    })
  }

  const moveDraw = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const stroke = strokesRef.current[strokesRef.current.length - 1]
    stroke.points.push(getPos(e))
    redraw()
  }

  const endDraw = () => { drawingRef.current = false }

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return
    redoStackRef.current.push(strokesRef.current.pop())
    redraw()
  }

  const handleRedo = () => {
    const s = redoStackRef.current.pop()
    if (!s) return
    strokesRef.current.push(s)
    redraw()
  }

  const handleClear = () => {
    redoStackRef.current = []
    strokesRef.current = []
    redraw()
  }

  const handleInsert = () => {
    const src = canvasRef.current
    if (!src) return
    // Flatten onto white and downscale to max 1000px wide
    const MAX_W = 1000
    const scale = Math.min(1, MAX_W / CANVAS_W)
    const out = document.createElement("canvas")
    out.width = Math.round(CANVAS_W * scale)
    out.height = Math.round(CANVAS_H * scale)
    const octx = out.getContext("2d")
    octx.fillStyle = "#ffffff"
    octx.fillRect(0, 0, out.width, out.height)
    octx.drawImage(src, 0, 0, out.width, out.height)
    onInsert?.(out.toDataURL("image/png"))
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Draw a Diagram</DialogTitle>
          <DialogDescription>
            Sketch the diagram, then press Insert to add it to the question.
          </DialogDescription>
        </DialogHeader>

        {/* Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant={tool === "pen" ? "default" : "outline"} size="sm" onClick={() => setTool("pen")}>
            <Pen className="size-4 mr-1" /> Pen
          </Button>
          <Button type="button" variant={tool === "eraser" ? "default" : "outline"} size="sm" onClick={() => setTool("eraser")}>
            <Eraser className="size-4 mr-1" /> Eraser
          </Button>

          <span className="w-px h-5 bg-border mx-1" />

          {PAD_COLORS.map((c) => (
            <button
              key={c} type="button" title={`Color ${c}`}
              onClick={() => { setColor(c); setTool("pen") }}
              className={`size-6 rounded-full border-2 transition-transform ${color === c ? "border-primary scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}

          <span className="w-px h-5 bg-border mx-1" />

          {PAD_WIDTHS.map((w) => (
            <button
              key={w} type="button" title={`${w}px`}
              onClick={() => setLineWidth(w)}
              className={`size-7 rounded-md border flex items-center justify-center ${lineWidth === w ? "border-primary bg-muted" : "border-input"}`}
            >
              <span className="rounded-full bg-foreground block" style={{ width: w + 2, height: w + 2 }} />
            </button>
          ))}

          <span className="w-px h-5 bg-border mx-1" />

          <Button type="button" variant="ghost" size="sm" onClick={handleUndo}><Undo2 className="size-4 mr-1" /> Undo</Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleRedo}>Redo</Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}><Trash2 className="size-4 mr-1" /> Clear</Button>
        </div>

        {/* Canvas */}
        <div className="rounded-lg border overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="block w-full touch-none cursor-crosshair"
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button type="button" onClick={handleInsert}>Insert Diagram</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
