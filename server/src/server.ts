import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';

import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from './routes/auth';
import { uploadRoutes } from './routes/upload';
import { resolve } from 'path';

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads'
})

app.register(cors, {
  // origin: ['http://localhost:3000'] SOMENTE ESSA URL PODE ACESSAR MEU BACK-END
  origin: true, //TODAS AS URLS DE FRONT-END PODE ACESSAR MEU BACK-END
})

app.register(jwt, {
  secret: 'spacetime', //ESSE TOKEN SERÁ CRIPTOGRAFADO PORÉM QUALQUER USUÁRIO CONSEGUIRAR LER, É APENAS PARA GUARDAR INFORMAÇÕES NÃO SENSÍVEIS
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app.listen({
  port: 3333,
  host: '0.0.0.0' //PARA MOBILE
})
.then(() => console.log("👌 HTTTP server running on http://localhost:3333"))