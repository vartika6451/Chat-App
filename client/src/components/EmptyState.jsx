import React from "react";
import { motion } from "framer-motion";

const EmptyState = ({
  title,
  description,
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto h-full ${className}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-16 h-16 rounded-2xl bg-brand-surface border border-zinc-800 flex items-center justify-center text-gray-400 mb-5 shadow-inner"
      >
        {icon}
      </motion.div>
      <motion.h3
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-lg font-bold text-white mb-2 tracking-wide"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-brand-text-secondary leading-relaxed mb-6"
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};

export default EmptyState;
