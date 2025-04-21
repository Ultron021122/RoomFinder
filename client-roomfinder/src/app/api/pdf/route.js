// app/api/pdf/route.js
import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceDocument } from '@/components/invoice'

export async function GET(request) {
  const stream = await renderToStream(<InvoiceDocument name="Juan Pérez" />)

  const headers = new Headers()
  headers.set('Content-Type', 'application/pdf')
  headers.set('Content-Disposition', 'attachment; filename="factura.pdf"')

  return new NextResponse(stream, { headers })
}
