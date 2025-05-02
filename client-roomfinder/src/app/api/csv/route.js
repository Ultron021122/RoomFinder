// /pages/api/export.ts

import { NextResponse } from "next/server"

export async function POST(req) {
  const secretKey = req.headers.get('x-secret-key');
  if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json()

  if (!Array.isArray(data) || data.length === 0) {
    return new NextResponse('No hay datos para exportar', { status: 400 })
  }

  const csvHeaders = [
    'ID Solicitud',
    'Título',
    'Estudiante',
    'Costo Renta',
    'Inicio',
    'Fin',
    'Estado',
  ]

  const csvRows = data.map(d => [
    d.requestid,
    d.vchtitle,
    `${d.vchstudentname} ${d.vchstudentpaternalsurname} ${d.vchstudentmaternalsurname}`,
    d.decrentalcost,
    d.dtstartdate?.split('T')[0],
    d.dtenddate?.split('T')[0],
    d.statusid,
  ])

  const csv = [
    csvHeaders.join(','),
    ...csvRows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  // 👇 Agregamos BOM al inicio
  const csvWithBom = '\uFEFF' + csv

  const headers = new Headers()
  headers.set('Content-Type', 'text/csv; charset=utf-8')
  headers.set('Content-Disposition', 'attachment; filename=solicitudes.csv')

  return new NextResponse(csvWithBom, { headers })
}
