/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
    },
  },
};

const BouncyText = ({ text }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="text-primary font-bold text-xl flex"
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={item} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default BouncyText;
