export const config = {
    host: process.env.DB_HOST ?? 'localhost',
    user: process.env.DB_USER_POSTGRES ?? 'postgres',
    port: process.env.DB_PORT_POSTGRES ?? 5432,
    password: process.env.DB_PASSWORD_POSTGRES ?? 'admin',
    database: process.env.DB_DATABASE ?? 'roomfinder'
}