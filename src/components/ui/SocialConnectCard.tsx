'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SocialConnectCardProps {
    icon: LucideIcon;
    name: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    color: string;
    disabled?: boolean;
    error?: string;
}

export const SocialConnectCard: React.FC<SocialConnectCardProps> = ({
    icon: Icon,
    name,
    placeholder,
    value,
    onChange,
    color,
    disabled = false,
    error
}) => {

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

    return (
        <motion.div 
            className="relative group"
            variants={fieldVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.2 }}
        >
            {/* 배경 글로우 */}
            <motion.div 
                className={`${color} absolute inset-0 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
            />

            {/* 카드 내용 */}
            <div 
                className='relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300'
            >
                {/* 헤더 */}
                <motion.div 
                    className='flex items-center mb-3'
                    initial={{
                        x: -10,
                        opacity: 0
                    }}
                    animate={{
                        x: 0,
                        opacity: 1
                    }}
                    transition={{
                        delay: .1
                    }}
                >
                    <motion.div 
                        className={`${color} p-2 bg-gradient-to-r rounded-xl mr-3`}
                        whileHover={{
                            rotate: 5,
                            scale: 1.1
                        }}
                    >
                        <Icon className='w-5 h-5 text-white' />
                    </motion.div>
                    <h3 className='text-white font-semibold'>{name}</h3>
                    {error && (
                        <motion.div 
                            className="ml-auto"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <svg 
                                className='w-4 h-4 text-red-400'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path 
                                    fillRule='evenodd'
                                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </motion.div>
                    )}
                </motion.div>
                
                {/* 입력 */}
                <motion.input
                    type='text'
                    placeholder={placeholder}
                    value={value}
                    onChange={
                        (e) => onChange(e.target.value)
                    }
                    disabled={disabled}
                    className={`
                        w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? 'border-red-400' : 'border-white/20'} 
                    `}
                    initial={{
                        y: 10, 
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        delay: .2
                    }}
                    whileFocus={{
                        scale: 1.02
                    }}
                />

                {/* 에러 메시지 */}
                {error && (
                    <motion.div 
                        className='flex items-center mt-2 text-red-400 text-xs'
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
                            className='w-3 h-3 mr-1' 
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
            </div>
        </motion.div>
    );
};

SocialConnectCard.displayName = 'SocialConnectCard';