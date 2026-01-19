import { motion } from "framer-motion";

function FloatingItem({ item, onClick }) {
  return (
    <motion.div
    whileTap={
      item.type === "heart"
        ? { scale: 1.2 }
        : { rotate: [0, -10, 10, -10, 0] }
    }    
      onPointerDown={onClick}
      className="absolute flex items-center justify-center"
      style={{
        left: `${item.x}%`,
        width: item.size + 20,
        height: item.size + 20,
        touchAction: "none",
      }}
      initial={{ bottom: -60, opacity: 0 }}
      animate={{ bottom: "100%", opacity: 1 }}
      transition={{ duration: 5, ease: "linear" }}
    >
      <img
        src={item.image}
        alt={item.type}
        draggable={false}
        className="pointer-events-none select-none"
        style={{ width: item.size }}
      />
    </motion.div>
  );
}

export default FloatingItem;