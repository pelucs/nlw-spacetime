import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance){
  
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880 //5MB
      }
    })

    //CASO O USUÁRIO CHAME A REQUISIÇÃO MAS NÃO ENVIE NADA
    if(!upload){
      return reply.status(400).send()
    }

    //FORMATOS QUE A REQUISIÇÃO IRÁ ACEITAR
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/

    //IRÁ VERIFICAR SE O ARQUIVO É IMAGEM OU VÍDEO
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    //SE NÃO FOR IMAGEM OU VÍDEO IRÁ DISPARAR ESSE ERRO
    if(!isValidFileFormat){
      return reply.status(400).send()
    }

    //CRIAREMOS UM ID ÚNICO PARA CADA ARQUIVO
    const fileId = randomUUID();
    const extension = extname(upload.filename); //PEGAREMOS A EXTENSÃO DO ARQUIVO
    const fileName = fileId.concat(extension); //IREMOS CONCATENAR O ID GERADO + ESTENSÃO 

    const writeStream = createWriteStream(
      resolve(__dirname, '..', '..', 'uploads', fileName),
    ) 

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat("://").concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString() 

    return { fileUrl }
  })
}