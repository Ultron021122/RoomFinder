import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

// 💅 Estilos elegantes
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E40AF',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1E3A8A',
  },
  thanks: {
    marginTop: 40,
    fontSize: 14,
    textAlign: 'center',
    color: '#16A34A',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    marginVertical: 20,
  },
})

export const InvoiceDocument = ({ name }: { name: string }) => {
  const today = new Date().toLocaleDateString('es-MX')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo y fecha */}
        <View style={styles.logoContainer}>
          <Image
            src="https://roomfinder.website/_next/image?url=%2Futils%2Frf3.png&w=1920&q=75"
            style={styles.logo}
          />
          <View style={styles.headerRight}>
            <Text>RoomFinder</Text>
            <Text>{today}</Text>
          </View>
        </View>

        {/* Título de la factura */}
        <Text style={styles.title}>Factura de Servicio</Text>

        {/* Datos del cliente */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre del Cliente:</Text>
          <Text>{name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Concepto:</Text>
          <Text>Servicio de búsqueda de alojamiento para estudiantes.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total:</Text>
          <Text>$500.00 MXN</Text>
        </View>

        <View style={styles.divider} />

        {/* Agradecimiento */}
        <Text style={styles.thanks}>
          ¡Gracias por confiar en RoomFinder! Esperamos que encuentres el hogar perfecto.
        </Text>
      </Page>
    </Document>
  )
}
