'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Search, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'


// Definimos la interfaz para los usuarios
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipo: 'Estudiante' | 'Propietario';
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
}

// Datos de ejemplo para usuarios
const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: 'Ana García', email: 'ana@universidad.es', tipo: 'Estudiante', estado: 'Activo' },
  { id: 2, nombre: 'Carlos López', email: 'carlos@universidad.es', tipo: 'Propietario', estado: 'Inactivo' },
  { id: 3, nombre: 'María Rodríguez', email: 'maria@universidad.es', tipo: 'Estudiante', estado: 'Activo' },
  { id: 4, nombre: 'Juan Martínez', email: 'juan@universidad.es', tipo: 'Propietario', estado: 'Activo' },
  { id: 5, nombre: 'Laura Sánchez', email: 'laura@universidad.es', tipo: 'Estudiante', estado: 'Pendiente' },
  { id: 6, nombre: 'Pedro Gómez', email: 'pedro@universidad.es', tipo: 'Estudiante', estado: 'Activo' },
  { id: 7, nombre: 'Sofía Fernández', email: 'sofia@universidad.es', tipo: 'Propietario', estado: 'Activo' },
  { id: 8, nombre: 'Diego Ruiz', email: 'diego@universidad.es', tipo: 'Estudiante', estado: 'Inactivo' },
  { id: 9, nombre: 'Elena Torres', email: 'elena@universidad.es', tipo: 'Propietario', estado: 'Pendiente' },
  { id: 10, nombre: 'Javier Navarro', email: 'javier@universidad.es', tipo: 'Estudiante', estado: 'Activo' },
  { id: 11, nombre: 'Carmen Molina', email: 'carmen@universidad.es', tipo: 'Propietario', estado: 'Activo' },
  { id: 12, nombre: 'Andrés Vega', email: 'andres@universidad.es', tipo: 'Estudiante', estado: 'Inactivo' },
]

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales)
  const [busqueda, setBusqueda] = useState<string>('')
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false)
  const [paginaActual, setPaginaActual] = useState<number>(1)
  const [usuariosPorPagina] = useState<number>(10)

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  const usuariosFiltrados = filtrarUsuarios()
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina)

  const obtenerUsuariosPaginados = () => {
    const indiceInicio = (paginaActual - 1) * usuariosPorPagina
    const indiceFin = indiceInicio + usuariosPorPagina
    return usuariosFiltrados.slice(indiceInicio, indiceFin)
  }

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioEditando(usuario)
    setDialogoAbierto(true)
  }

  const handleGuardarCambios = () => {
    if (usuarioEditando) {
      setUsuarios(usuarios.map(u => u.id === usuarioEditando.id ? usuarioEditando : u))
      setDialogoAbierto(false)
      toast.success('Usuario actualizado con éxito', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleEliminarUsuario = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
      toast.success('Usuario eliminado con éxito', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <div className="bg-gradient-to-r p-2 md:p-8">
      <Card className="overflow-hidden w-full max-w-8xl mx-auto bg-gray-300 dark:bg-gray-950">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Administración de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar Usuario
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obtenerUsuariosPaginados().map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.tipo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={usuario.estado === 'Activo' ? 'default' :
                               usuario.estado === 'Inactivo' ? 'secondary' : 'outline'}
                    >
                      {usuario.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditarUsuario(usuario)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEliminarUsuario(usuario.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((paginaActual - 1) * usuariosPorPagina) + 1} - {Math.min(paginaActual * usuariosPorPagina, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <Button
                  key={pagina}
                  variant={pagina === paginaActual ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaginaActual(pagina)}
                >
                  {pagina}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {usuarioEditando && (
            <form onSubmit={(e) => { e.preventDefault(); handleGuardarCambios(); }} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={usuarioEditando.nombre}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, nombre: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={usuarioEditando.email}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={usuarioEditando.tipo}
                  onValueChange={(value) => setUsuarioEditando({...usuarioEditando, tipo: value as 'Estudiante' | 'Propietario'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estudiante">Estudiante</SelectItem>
                    <SelectItem value="Propietario">Propietario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={usuarioEditando.estado}
                  onValueChange={(value) => setUsuarioEditando({...usuarioEditando, estado: value as 'Activo' | 'Inactivo' | 'Pendiente'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado del usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Guardar Cambios</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  )
}
