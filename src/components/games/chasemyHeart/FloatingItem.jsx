import { motion } from "framer-motion";
import heart from '../../../assets/heart.png'
import bomb from '../../../assets/bomb.png'

function FloatingItem({ item, onClick }) {
  return (
    <motion.img
      src={
        item.type === "heart"
          ? `${heart}`
          : `${bomb}`
      }
      onClick={onClick}
      className="absolute cursor-pointer select-none"
      style={{
        left: `${item.x}%`,
        width: item.size,
      }}
      initial={{ bottom: -60, opacity: 0 }}
      animate={{ bottom: "100%", opacity: 100 }}
      transition={{ duration: 5, ease: "linear" }}
      draggable={false}
    />
  );
}

export default FloatingItem;
