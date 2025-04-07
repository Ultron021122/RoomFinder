import 'dotenv/config'
import app from './app.js'
import './server/authomatic.js'

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})