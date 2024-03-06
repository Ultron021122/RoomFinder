export const options = {
    basePath: '/',
    definition: {
        openapi: '3.0.0',
        info: {
            title: "RoomFinder",
            description: 'Autor: Sebastián Martínez López, Documentación de la API.',
            version: '1.9'
        }
    },
    apis: ['./src/routes/**/*.js']
}