'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
    icon: LucideIcon;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    showToggle?: boolean;
    onToggle?: () => void;
    toggleIcon?: LucideIcon;
    className?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
    icon: Icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    showToggle = false,
    onToggle,
    toggleIcon: ToggleIcon,
    className = '',
    ...props
}, ref) => {

    const fieldVariants = {
        hidden: {
            opacity: 0, 
            y: 20, 
            scale: .95 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                duration: .3, 
                ease: 'easeOut' as const
            }
        }
    };

    const bgVariants = {
        active: {
            opacity: [.2, .4, .2],
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut' as const
            }
        }
    };

    return (
        <motion.div 
            className={`relative group ${className}`}
            variants={fieldVariants}
            initial='hidden'
            animate='visible'
            whileHover={{ 
                scale: 1.02, 
                transition: {
                    duration: 0.2
                }
            }}
        >
            {/* 배경 */}
            <motion.div 
                className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300'
                variants={bgVariants}
                animate='active'
            />

            <div className="relative">
                {/* 아이콘 */}
                <motion.div
                    initial={{
                        opacity: 0, 
                        x: -10 
                    }}
                    animate={{
                        opacity: 1,
                        x: 0
                    }}
                    transition={{
                        delay: .1
                    }}
                >
                    <Icon className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10' />
                </motion.div>

                {/* 입력 필드 */}
                <motion.input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`
                      w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                      ${error ? 'border-red-400' : 'border-white/20'} 
                    `}
                    initial={{
                        opacity: 0,
                        y: 10
                    }}
                    animate={{
                        opacity: 1, 
                        y: 0 
                    }}
                    transition={{
                        delay: 0.2
                    }}
                    whileFocus={{
                        scale: 1.02
                    }}
                    {...props}
                />

                {/* 토글 버튼 */}
                {showToggle && ToggleIcon && (
                    <motion.button
                        type='button'
                        onClick={onToggle}
                        disabled={disabled}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50'
                        whileHover={{
                            scale: 1.1
                        }}
                        whileTap={{
                            scale: 0.9
                        }}
                    >
                        <ToggleIcon className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
            
            {/* 에러 메시지 */}
            {error && (
                <motion.div 
                    className='flex items-center mt-2 text-red-400 text-sm'
                    initial={{
                        opacity: 0,
                        height: 0,
                        y: -10
                    }}
                    animate={{
                        opacity: 1,
                        height: 'auto',
                        y: 0
                    }}
                    exit={{
                        opacity: 0,
                        height: 0,
                        y: -10
                    }}
                    transition={{
                        duration: .3
                    }}
                >
                    <motion.svg
                        className='w-4 h-4 mr-1'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        initial={{
                            scale: 0
                        }}
                        animate={{
                            scale: 1
                        }}
                        transition={{
                            delay: .1
                        }}
                    >
                        <path 
                            fillRule='evenodd' 
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd' 
                        />
                    </motion.svg>
                    {error}
                </motion.div>
            )}
        </motion.div>
    );
});

InputField.displayName = 'InputField';