import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedSection({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
