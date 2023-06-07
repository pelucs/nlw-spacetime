import { getUser } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default () => {

  const { name, avatarUrl } = getUser()

  return(
    <div className="flex items-center gap-3 text-left">
      <Image src={avatarUrl} width={40} height={40} alt="" className="w-10 h-10 rounded-full"/>

      <p className="max-w-[140px] text-sm leading-snug">
        {name}

        <a 
          href="/api/auth/logout" 
          className="flex items-center gap-1 text-red-300 hover:text-red-400 transition-colors"
        >
          Quero sair <LogOut className="w-4"/>
        </a>
      </p>
    </div>
  );
}