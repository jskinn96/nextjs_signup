'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Github } from 'lucide-react';
import { SocialConnectCard } from '@/components/ui/SocialConnectCard';
import { useSignUpErrors, useSignUpFormData, useSignUpLoading, useSignUpStore } from '@/stores';

export const Step3: React.FC = () => {

    //g 스토어 훅
    const formData = useSignUpFormData();
    const errors = useSignUpErrors();
    const isLoading = useSignUpLoading();

    //g 스토어 셋
    const setField = useSignUpStore((state) => state.setField);

    const stepVariants = {
        hidden: {
            opacity: 0,
            x: 100
        },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                duration: .4,
                ease: 'easeOut' as const,
                staggerChildren: .1
            }
        },
        exit: { 
            opacity: 0, 
            x: -100,
            transition: {
                duration: .3
            }
        }
    };

    const socialPlatforms = [
        {
            icon: Facebook,
            name: 'Facebook',
            field: 'facebook' as const,
            placeholder: 'Facebook 계정명',
            color: 'from-blue-600 to-blue-700'
        },
        {
            icon: Instagram,
            name: 'Instagram',
            field: 'instagram' as const,
            placeholder: 'Instagram 계정명',
            color: 'from-pink-500 to-purple-600'
        },
        {
            icon: Github,
            name: 'GitHub',
            field: 'github' as const,
            placeholder: 'GitHub 계정명',
            color: 'from-gray-700 to-gray-800'
        }
    ];

    return (
        <motion.div 
            className='space-y-6'
            variants={stepVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            {/* 헤더 */}
            <motion.div 
                className='text-center mb-6'
                initial={{
                    y: -20,
                    opacity: 0
                }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    delay: .2
                }}
            >
                <h3 className='text-xl font-semibold text-white mb-2'>소셜 계정 연결</h3>
                <p className='text-gray-300 text-sm'>선택사항으로 나중에도 연결할 수 있어요!</p>
            </motion.div>

            {/* SNS 연결 카드 */}
            <motion.div 
                className='grid grid-cols-1 gap-4'
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: .1 
                        }
                    }
                }}
            >
                {socialPlatforms.map(platform => (
                    <SocialConnectCard
                        key={platform.field}
                        icon={platform.icon}
                        name={platform.name}
                        placeholder={platform.placeholder}
                        value={formData[platform.field]}
                        onChange={
                            (value) => setField(platform.field, value)
                        }
                        color={platform.color}
                        disabled={isLoading}
                        error={errors[platform.field]}
                    />
                ))}
            </motion.div>
            
            {/* 약관 동의 */}
            <motion.div 
                className='space-y-4 mt-8'
                initial={{
                    y: 20, 
                    opacity: 0
                }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{ 
                    delay: .5 
                }}
            >
                {/* 이용약관 동의 */}
                <motion.label 
                    className='flex items-center space-x-3 cursor-pointer'
                    whileHover={{
                        x: 5
                    }}
                    transition={{
                        duration: .2
                    }}
                >
                    <motion.input
                        type='checkbox'
                        checked={formData.agreeTerms}
                        onChange={
                            (e) => setField('agreeTerms', e.target.checked)
                        }
                        disabled={isLoading}
                        className='w-5 h-5 text-purple-600 border-2 border-white/20 rounded focus:ring-purple-500 bg-white/10 disabled:opacity-50'
                        whileHover={{
                            scale: 1.1
                        }}
                        whileTap={{
                            scale: .9
                        }}
                    />
                    <span className='text-white'>
                        <span className='text-red-400'>*</span> 이용약관 및 개인정보처리방침에 동의합니다
                    </span>
                </motion.label>

                {/* 에러 메시지 */}
                {errors.agreeTerms && (
                    <motion.div 
                        className='flex items-center ml-8 text-red-400 text-sm'
                        initial={{
                            opacity: 0,
                            height: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: 'auto'
                        }}
                        exit={{ opacity: 0, height: 0 }}
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
                        {errors.agreeTerms}
                    </motion.div>
                )}

                {/* 마케팅 동의 */}
                <motion.label 
                    className='flex items-center space-x-3 cursor-pointer'
                    whileHover={{
                        x: 5 
                    }}
                    transition={{
                        duration: 0.2
                    }}
                >
                    <motion.input
                        type='checkbox'
                        checked={formData.agreeMarketing}
                        onChange={
                            (e) => setField('agreeMarketing', e.target.checked)
                        }
                        disabled={isLoading}
                        className='w-5 h-5 text-purple-600 border-2 border-white/20 rounded focus:ring-purple-500 bg-white/10 disabled:opacity-50'
                        whileHover={{ 
                            scale: 1.1
                        }}
                        whileTap={{ 
                            scale: .9 
                        }}
                    />
                    <span className='text-white'>마케팅 정보 수신에 동의합니다 (선택)</span>
              </motion.label>
            </motion.div>
        </motion.div>
    );
};
