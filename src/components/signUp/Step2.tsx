'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, User, Sparkles } from 'lucide-react';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { useSignUpErrors, useSignUpFormData, useSignUpLoading, useSignUpStore } from '@/stores';
import { ISignUpFormData } from '@/types';

const genderOptions = [
    {
        value: 'male', 
        label: '남성'
    },
    {
        value: 'female', 
        label: '여성'
    },
    {
        value: 'other', 
        label: '기타'
    }
];

export const Step2: React.FC = () => {

    //g 스토어 훅
    const formData = useSignUpFormData();
    const errors = useSignUpErrors();
    const isLoading = useSignUpLoading();

    //g 스토어 셋
    const setField = useSignUpStore((state) => state.setField);

    const stepVariants = useMemo(() => ({
        hidden: {
            opacity: 0, 
            x: 100
        },
        visible: { 
            opacity: 1, 
            x: 0
        },
        exit: { 
            opacity: 0, 
            x: -100,
            transition: {
                duration: .3
            }
        }
    }), []);

    const fieldVariants = useMemo(() => ({
        hidden: {
            opacity: 0, 
            y: 20, 
            scale: .95
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1
        }
    }), []);

    const areaBgVariants = useMemo(() => ({
        active: {
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
        }
    }), []);

    return (
        <motion.div 
            className='space-y-6'
            transition={{ 
                duration: .4,
                ease: 'easeOut',
                staggerChildren: .1
            }}
            variants={stepVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <InputField
                icon={Calendar}
                type='date'
                placeholder='생년월일'
                value={formData.birthDate}
                onChange={
                    (value) => setField('birthDate', value)
                }
                error={errors.birthDate}
                disabled={isLoading}
            />

            <SelectField
                icon={Heart}
                placeholder='성별을 선택해주세요'
                value={formData.gender || ''}
                onChange={
                    (value) => {setField('gender', value as ISignUpFormData['gender'])}
                }
                options={genderOptions}
                error={errors.gender}
                disabled={isLoading}
            />

            <InputField
                icon={User}
                type='text'
                placeholder='닉네임'
                value={formData.nickname}
                onChange={
                    (value) => setField('nickname', value)
                }
                error={errors.nickname}
                disabled={isLoading}
            />

            {/* 관심사 텍스트 에리어 */}
            <motion.div 
                className='relative group'
                transition={{
                    duration: .3,
                    ease: 'easeOut'
                }}
                variants={fieldVariants}
                whileHover={{ scale: 1.02 }}
            >
                {/* 에리어 배경 */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    variants={areaBgVariants}
                    animate='active'
                />

                <div className='relative'>
                    <Sparkles
                        className='absolute left-4 top-4 text-gray-400 w-5 h-5 z-10' 
                    />
                    <motion.textarea
                        placeholder='관심사를 자유롭게 적어주세요'
                        value={formData.interests}
                        onChange={
                            (e) => setField('interests', e.target.value)
                        }
                        disabled={isLoading}
                        rows={4}
                        className={`
                            w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-nonedisabled:opacity-50 disabled:cursor-not-allowed
                            ${errors.interests ? 'border-red-400' : 'border-white/20'} 
                        `}
                        whileFocus={{
                            scale: 1.02
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};