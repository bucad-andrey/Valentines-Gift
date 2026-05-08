import React, { useState } from 'react'
import generateGiftURL from './generateGiftURL'
import { auth } from '../../../config/firestore';
import GuideOverlayed from '../../../shared/guide/GuideOverlayed';
import { LETTER_GUIDE } from '../../../shared/constant/useGuideText';

function generatedUrl() {
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
      <GuideOverlayed
        guideText={LETTER_GUIDE} 
      />
      
      <button onClick={handleGenerate} className=''>
        Generate Url
      </button>
      <a href={generatedUrl} target='_blank'>
        {generatedUrl}
      </a>
    </section>
  )
}

export default generatedUrl;