import Fastify, { FastifyInstance } from 'fastify'
export const server: FastifyInstance = Fastify({
    logger: true,
})

import bucketRoutes from './routes/buckets'
import objectRoutes from './routes/objects'

// Disable CORS
server.addHook('preHandler', (req, res, done) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')

    const isPreflight = /options/i.test(req.method)
    if (isPreflight) {
        return res.send()
    }

    done()
})

server.register(bucketRoutes, { prefix: '/api' })
server.register(objectRoutes, { prefix: '/api' })

const start = async () => {
    try {
        await server.listen({ port: 3000 })

        const address = server.server.address()
        const port = typeof address === 'string' ? address : address?.port

        console.log(`Server is listening at http://localhost:${port}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
