import type { HTMLAttributes } from 'react';
import styles from './Badge.module.css';

type BadgeColor = 'default' | 'purple' | 'cyan' | 'pink' | 'orange' | 'green' | 'blue' | 'yellow';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  color?: BadgeColor;
}

export function Badge({ children, className = '', color = 'default', ...props }: BadgeProps) {
  const colorClass = color !== 'default' ? styles[color] : '';
  return (
    <span className={`${styles.badge} ${colorClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
