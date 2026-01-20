import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import productRoutes from "./modules/product/product.routes";
import fjwt from "@fastify/jwt"
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { withRefResolver } from "fastify-zod";
import fastifyCors from "@fastify/cors";


export const server = Fastify({logger: true});
server.register(fjwt, {
    secret: "distaste_cyberwantsathhinkpadp14switnvidiat500"
})

const envVar = process.env.PORT;

const PORT = envVar ? parseInt(envVar) : 3000;

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any,
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number,
            email: string,
            name: string,
        }
    }
}
server.register(fastifySwagger, withRefResolver({
  openapi: {
    info: {
      title: 'fastify-api',
      version: '1.0.0',
    },
  },
}));

server.register(fastifyCors, {
  origin: [
    "http://localhost:8081",
    "http://localhost:19006", // Expo web (optional)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});


server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch(e){
        return reply.send(e)
    }
})
server.get("/healthcheck", async () => {
    return { status: "OK"};
})

async function main() {

    for(const schema of [...userSchemas, ...productSchemas]){
        server.addSchema(schema)
    }

    server.register(userRoutes, { prefix: "api/users"});
    server.register(productRoutes, { prefix: "api/products"})

    try{
        await server.listen({
            port: PORT,
            host: "0.0.0.0",
        })
    } catch(err){
        server.log.error(err);
        process.exit(1);
    }
}

main()