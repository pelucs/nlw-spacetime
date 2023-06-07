import Image from 'next/image';
import Link from 'next/link';

import logo from '../assets/nlw-spactime-logo.svg';

export default () => {
  return(
    <div className="space-y-5">
      <Image src={logo} alt=""/>

      <div className="max-w-[420px] space-y-1">
        <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>

        <p className="text-lg leading-relaxed">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
        </p>
      </div>

      <Link
        href="/memories/new" 
        className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase 
        leading-none text-black hover:bg-green-600 transition-colors"
      >
        Cadastrar lebrança
      </Link>
    </div>
  )
}