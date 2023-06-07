import NewMemoryForm from "@/components/NewMemoryForm";
import { ChevronLeft } from "lucide-react";

import Link from "next/link";

export default () => {
  return(
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link href="/" className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100 transition-colors">
        <ChevronLeft className="w-4 h-4"/>

        Voltar à timeline
      </Link>

      <NewMemoryForm/>
    </div>
  );
}