import React, { useState } from 'react'
import { auth } from '../utils/firestore';

function previewLetter() {
  const [message, setMessage] = useState();
  

  const fetchMessage = async = () => {
    if(auth?.currentUser?.uid) return
    try {
    
   } catch (error) {
    
   } 
  }

  return (
    <div>
      
      {isViewing && (
          <div
            className="
              absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              h-[500px] w-[400px]
              p-16 mg:p-8 pt-12 md:pt-3

              font-[Patrick_Hand]
              text-lg
              leading-6 mg:leading-8
              tracking-wide 
              text-black

              whitespace-pre-wrap
            "
          >
            {animatedText}
          </div>
        )}
    </div>
  )
}

export default previewLetter