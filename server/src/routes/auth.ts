import axios from 'axios';

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance){
  
  //VALIDANDO O CÓDIGO QUE O GITHUB ME DARÁ
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    //PEGANDO O ACESS_TOKEN DO GITHUB
    const accessTokenResponse = await axios.post(
      'https:/github.com/login/oauth/access_token', //URL
      null, //CORPO DA REQUISIÇÃO, QUE NO CASO NÃO TEMOS ENTÃO SERÁ NULL
      {
        params: { //NO AXIOS PODEMOS COLCOAR OS PAR6ÂMETROS SEPARADOS 
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json' //FORMATO DA REQUISIÇÃO QUE EU QUERO (JSON)
        }
      },
    );

    const { access_token } = accessTokenResponse.data;

    const authSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url()
    });

    //PEGANDO AS INFORMAÇÕES DO USUÁRIO
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userInfo = authSchema.parse(userResponse.data);

    //VAMOS VERIFICAR SE JÁ EXISTE O USUÁRIO NO BANCO DE DADOS
    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id
      }
    });

    if(!user){
      await prisma.user.create({
        data: {
          name: userInfo.name,
          githubId: userInfo.id,
          login: userInfo.login,
          avatarURL: userInfo.avatar_url,
        }
      })
    }

    //REGISTRANDO O TOKEN JWT - VERIFICAR NOVAMENTE
    let token = app.jwt.sign(
      {
        //INFORMAÇÕES PÚBLICAS
        name: user?.name,
        avatarUrl: user?.avatarURL
      }, {
        sub: user?.id, //INFORMAÇÃO ÚNICA DO USUÁRIO
        expiresIn: '30 days' //TEMPO QUE O USUÁRIO FICARÁ LOGADO
      }
    )

    return {
      token,
    }
  })
}