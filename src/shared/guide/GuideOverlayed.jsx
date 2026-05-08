import React from 'react'
import GuideTrigger from './GuideTrigger'
import { useGuideModal } from './useGuideModal'
import GuideModal from './GuideModal';
import "../../styles/guide.css";

function GuideOverlayed({
  guideText, 
}) {
  
  const {
    isOpen, 
    openGuide,
    closeGuide
  } = useGuideModal();

  return (
    <>
    <GuideTrigger
      onClick={openGuide}
      className="guide"
    />
    
    <GuideModal
      isOpen={isOpen}
      onClose={closeGuide}
    >
      <p className='text-green-500'>
        {guideText}
      </p>
    </GuideModal>
    </>
  )
}

export default GuideOverlayed