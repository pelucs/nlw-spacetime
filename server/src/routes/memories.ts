import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod';

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify() //IRÁ VALIDAR SE EXISTE TOKEN DE AUTENTICAÇÃO

    console.log(request.user)
  })

  //TODAS AS MEMÓRIAS
  app.get("/memories", async (request) => {

    //IRÁ LISTAR TODAS AS MEMÓRIAS DO USUÁRIO
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat("..."), //DEICAR P CONTEÚDO MENOR
        createdAt: memory.createdAt
      }
    })
  })
  
  //UMA MEMÓRIA ESPECÍFICA
  app.get("/memories/:id", async (request, reply) => {

    //O ZOD IRÁ VALIDAR O MEU PARÂMETRO
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    //DESESTRUTURAÇÃO DO PARÂMETRO
    const { id } = paramsSchema.parse(request.params);

    //BUSCANDO A MEMÓRIO PELO ID
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if(!memory.isPublic && memory.userId !== request.user.sub){
      return reply.status(401).send()
    }
    
    return memory
  })

  //CRIAÇÃO DE UMA MEMÓRIA
  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false) //COERCE => IRÁ CONVERTER O VALOR PARA BOLEANO
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body) //DESEESTRUTURANDO 

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub
      }
    }) 
    
    return memory
  })

  //ATUALIZAÇÃO DE UMA MEMÓRIA
  app.put("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false) //COERCE => IRÁ CONVERTER O VALOR PARA BOLEANO
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body) //DESEESTRUTURANDO 

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    //VERIFICANDO SE O USUÁRIO QU ESTÁ TENTANDO EDITAR A MEMÓRIA É O MESMO QUE À CRIOU
    if(memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      }
    })

    return memory
  })

  //DELETAR UMA MEMÓRIA
  app.delete("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    //VERIFICANDO SE O USUÁRIO QUE ESTÁ TENTANDO DELETAR A MEMÓRIA É O MESMO QUE À CRIOU
    if(memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      }
    })
  })
}