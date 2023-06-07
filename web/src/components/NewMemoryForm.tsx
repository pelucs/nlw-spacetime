'use client'

import Cookie from 'js-cookie'

import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { api } from "@/lib/api";

import MediaPicker from "./MediaPicker";

export default () => {

  const router = useRouter();

  const handleCreateMemory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //PEGAR TODOO CONTEÚDO DOS INPUTS
    const formData = new FormData(event.currentTarget);

    //PEGA SOMENTE A IMAGEM
    const fileToUpload = formData.get('coverURL');

    let coverUrl = '';

    if(fileToUpload){
      const uploadFormData = new FormData(); //CRIA UMA NOVA INSTÂNCIA
      uploadFormData.set('file', fileToUpload); 

      //ENVIANDO PARA O BANCO DE DADOS
      const uploadResponse = await api.post('/upload', uploadFormData);

      //RECEBENDO A URL DA IMAGEM
      coverUrl = uploadResponse.data.fileUrl;
    }

    //PEGANDO O TOKEN DO USUÁRIO
    const token = Cookie.get('token');

    //ENVIANDO A MEMÓRIA CRIADA PARA O USUÁRIO QUE ESTÁ LOGADO
    await api.post('/memories', {
      coverUrl,
      content: formData.get('content'),
      isPublic: formData.get('isPublic')
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    router.push('/');
  }

  return(
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label 
          htmlFor="midia" 
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="w-4 h-4"/>

          Anexar mídia
        </label>

        <label 
          htmlFor="isPublic"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />

          Tornar memória pública
        </label>
      </div>

      <MediaPicker/>

      <textarea 
        name="content" 
        spellCheck={false} 
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        className="w-full flex-1 mt-5 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed
        text-gray-100 placeholder:text-gray-400 focus:ring-0"
      />

      <button 
        type="submit" 
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase 
        leading-none text-black hover:bg-green-600 transition-colors"
      >
        Salvar
      </button>
    </form>
  );
}