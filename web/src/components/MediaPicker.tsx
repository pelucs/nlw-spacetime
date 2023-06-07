'use client'

import { ChangeEvent, useState } from "react";

export default () => {
  const [preview, setPreview] = useState<null | string>(null); 

  const onFileSlected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if(!files){
      return
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  }

  return(
    <>
      <input 
        id="midia" 
        type="file" 
        name="coverURL"
        accept="image/*"
        className="invisible h-0 w-0"
        onChange={onFileSlected}
      />

      {preview && 
        <img 
          alt=""
          src={preview} 
          className="w-full aspect-video rounded-lg object-cover"
        />
      }
    </>
  );
}