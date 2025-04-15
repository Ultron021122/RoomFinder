export const options = {
    basePath: '/',
    definition: {
        openapi: '3.0.0',
        info: {
            title: "RoomFinder",
            description: 'Autor: Sebastián Martínez López, Documentación de la API.',
            version: '1.9'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
        },
        servers: [
            {
                url: 'http://localhost:1234',
                description: 'Development server'
            },
            {
                url: 'https://api.roomfinder.sebastianmartinez.dev',
                description: 'Production server'
            }
        ],
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ['./src/routes/**/*.js']
}