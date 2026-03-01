import React, { useState } from 'react'
import generateGiftURL from '../url generation/generateGiftURL'
import { auth } from '../utils/firestore';

function Preview() {
  const [generatedUrl, setGeneratedUrl] = useState()

  async function handleGenerate() {
    try {
      const url = await generateGiftURL({senderEmail : auth?.currentUser?.uid});
      console.log("🎉 FINAL URL:", url);
      setGeneratedUrl(url);
    } catch (err) {
      console.error("Generation failed:", err.message);
      alert(err.message);
    }
  }


  return (
    <section className='flex justify-center items-center flex-col space-y-10'>
      <button onClick={handleGenerate} className=''>
        Generate Url
      </button>

      <p>
        {generatedUrl}
      </p>
    </section>
  )
}

export default Preview