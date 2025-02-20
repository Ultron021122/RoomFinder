import 'dotenv/config';  // Para cargar las variables de entorno del archivo .env
import opencage from 'opencage-api-client';

export class PostalCodeService {
    constructor() {
        // La clave API de OpenCage, que se debe guardar en un archivo .env
        this.apiKey = process.env.OPENCAGE_API_KEY;
        this.defaultCountryCode = 'MX'; 
    }

    // Método para obtener la información de un código postal o dirección
    async getPostalCodeInfo({ query }) {
        const params = {
            key: this.apiKey,
            q: query,  // Código postal o dirección
            language: 'es',  // Idioma (opcional)
            pretty: 1,  // Formato legible (opcional)
            countrycode: this.defaultCountryCode // Limitación a solo un pais (opcional)
        };

        try {
            // Realizamos la solicitud usando la librería opencage-api-client
            const response = await opencage.geocode(params);

            if (response.status.code === 200) {
                const results = response.results;
                if (results.length > 0) {
                    const location = results[0];
                    return {
                        address: location.formatted,
                        country: location.components?.country,
                        state: location.components.state,
                        city: location.components.county,
                        postcode: location.components.postcode,
                        state_code: location.components.state_code,
                        lat: location.geometry.lat,
                        lng: location.geometry.lng
                    };
                } else {
                    return false;
                }
            } else {
                throw new Error(`Error en la solicitud: ${response.status.message}`);
            }
        } catch (error) {
            console.error('Error al obtener información:', error);
            return null;
        }
    }
}
