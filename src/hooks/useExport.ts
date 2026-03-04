import { useCallback } from 'react'
import html2canvas from 'html2canvas'
import type { ExportFormat } from '../types'

interface UseExportReturn {
  exportMap: (svgElement: SVGSVGElement, format: ExportFormat, filename?: string) => Promise<void>
}

function serializeSVG(svg: SVGSVGElement): string {
  const serializer = new XMLSerializer()
  const source = serializer.serializeToString(svg)
  return '<?xml version="1.0" standalone="no"?>\r\n' + source
}

async function exportAsSVG(svg: SVGSVGElement, filename: string): Promise<void> {
  const svgStr = serializeSVG(svg)
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, `${filename}.svg`)
  URL.revokeObjectURL(url)
}

async function exportAsPNG(svg: SVGSVGElement, filename: string): Promise<void> {
  // Wrap SVG in a div for html2canvas
  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.top = '-9999px'
  wrapper.style.left = '-9999px'
  wrapper.appendChild(svg.cloneNode(true))
  document.body.appendChild(wrapper)

  try {
    const canvas = await html2canvas(wrapper, {
      useCORS: true,
      scale: 2,
    })
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      triggerDownload(url, `${filename}.png`)
      URL.revokeObjectURL(url)
    })
  } finally {
    document.body.removeChild(wrapper)
  }
}

function exportAsIframe(svg: SVGSVGElement, filename: string): void {
  const svgStr = serializeSVG(svg)
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Batian Map</title>
  <style>body { margin: 0; display: flex; align-items: center; justify-content: center; } svg { max-width: 100%; height: auto; }</style>
</head>
<body>
${svgStr}
</body>
</html>`
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, `${filename}.html`)
  URL.revokeObjectURL(url)
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export function useExport(): UseExportReturn {
  const exportMap = useCallback(
    async (svgElement: SVGSVGElement, format: ExportFormat, filename = 'batian-map') => {
      switch (format) {
        case 'svg':
          await exportAsSVG(svgElement, filename)
          break
        case 'png':
          await exportAsPNG(svgElement, filename)
          break
        case 'iframe':
          exportAsIframe(svgElement, filename)
          break
      }
    },
    [],
  )

  return { exportMap }
}
