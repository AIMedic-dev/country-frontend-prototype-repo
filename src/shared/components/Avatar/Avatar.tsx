import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
}) => {
  // Generar iniciales del nombre
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const avatarClasses = [
    styles.avatar,
    styles[size],
    styles[variant],
  ].join(' ');

  return (
    <div className={avatarClasses}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className={styles.image} />
      ) : (
        <span className={styles.initials}>{name ? getInitials(name) : '?'}</span>
      )}
    </div>
  );
};