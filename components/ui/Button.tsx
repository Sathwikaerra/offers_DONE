import { type VariantProps, cva } from 'class-variance-authority';
import { Text, TouchableOpacity } from 'react-native';
import themeStyles from '../../styles';
// import { cn } from '../lib/utils';
import React from 'react';
import { COLORS } from '@/constants/theme';

const buttonVariants = cva(
  'flex flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: themeStyles.buttonPrimary,
        secondary: themeStyles.buttonSecondary,
        white: themeStyles.buttonWhite,
        // destructive: themeStyles.buttonDestructive,
        // ghost: themeStyles.buttonGhost,
        // link: themeStyles.buttonLink,
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-0',
        lg: 'h-12 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('text-center font-medium', {
  variants: {
    variant: {
      default: themeStyles.buttonTextPrimary,
      secondary: themeStyles.buttonTextSecondary,
      white: themeStyles.buttonTextWhite,
      // destructive: themeStyles.buttonTextDestructive,
      // ghost: themeStyles.buttonTextGhost,
      // link: themeStyles.buttonTextLink,
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
  VariantProps<typeof buttonVariants> {
  label: string;
  labelClasses?: string;
}
function Button({
  label,
  labelClasses,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
    activeOpacity={0.9}
      disabled={props.disabled}
      style={props.disabled ? themeStyles.buttonDisabled : variant === 'default' ? themeStyles.buttonPrimary : variant === 'secondary' ? themeStyles.buttonSecondary : themeStyles.buttonWhite}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      <Text
        style={variant === 'default' ? themeStyles.buttonTextPrimary : variant === 'secondary' ? themeStyles.buttonTextSecondary : themeStyles.buttonTextWhite}
        className={
          buttonTextVariants({ variant, size, className: labelClasses })
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export { Button, buttonVariants, buttonTextVariants };
