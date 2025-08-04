'use client';

import React, { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
    icon: LucideIcon;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(({
    icon: Icon,
    placeholder,
    value,
    onChange,
    options,
    error,
    disabled = false,
    className = '',
    ...props
}, ref) => {

    const fieldVariants = useMemo(() => ({
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
    }), []);

    const bgVariants = useMemo(() => ({
        active: {
            opacity: [.2, .4, .2],
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut' as const
            }
        }
    }), []);

    return (
        <motion.div 
            className={`relative group ${className}`}
            variants={fieldVariants}
            initial='hidden'
            animate='visible'
            whileHover={{
                scale: 1.02
            }}
        >
            {/* 배경 */}
            <motion.div 
                className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300'
                variants={bgVariants}
                animate='active'
            />

            <div className='relative'>
                {/* 아이콘 */}
                <Icon className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10' />

                {/* 셀렉트 필드 */}
                <motion.select
                    ref={ref}
                    value={value}
                    onChange={
                        (e) => onChange(e.target.value)
                    }
                    disabled={disabled}
                    className={`
                        w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? 'border-red-400' : 'border-white/20'} 
                    `}
                    whileFocus={{
                        scale: 1.02
                    }}
                    {...props}
                >
                    {placeholder && (
                        <option value='' className='bg-gray-800 text-gray-400'>
                            {placeholder}
                        </option>
                    )}
                    {options.map(option => (
                        <option 
                            key={option.value} 
                            value={option.value} 
                            className='bg-gray-800 text-white'
                        >
                            {option.label}
                        </option>
                    ))}
                </motion.select>
                
                {/* 드롭다운 화살표 */}
                <div 
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'
                >
                    <svg 
                        className='w-5 h-5 text-gray-400'
                        fill='none' 
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path 
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2} 
                            d='M19 9l-7 7-7-7'
                        />
                    </svg>
                </div>
            </div>
              
            {/* 에러 메시지 */}
            {error && (
                <motion.div 
                    className='flex items-center mt-2 text-red-400 text-sm'
                    initial={{
                        opacity: 0,
                        height: 0
                    }}
                    animate={{
                        opacity: 1,
                        height: 'auto'
                    }}
                    exit={{
                        opacity: 0, 
                        height: 0
                    }}
                >
                    <svg 
                        className='w-4 h-4 mr-1' 
                        fill='currentColor' 
                        viewBox='0 0 20 20'
                    >
                        <path 
                            fillRule='evenodd' 
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd' 
                        />
                    </svg>
                    {error}
                </motion.div>
            )}
        </motion.div>
    );
});

SelectField.displayName = 'SelectField';