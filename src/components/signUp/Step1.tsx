'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { InputField } from '@/components/ui/InputField';
import { useSignUpErrors, useSignUpFormData, useSignUpLoading, useSignUpStore } from '@/stores';

export const Step1: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

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
                duration: 0.3
            }
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
                icon={User}
                type='text'
                placeholder='아이디'
                value={formData.username}
                onChange={
                    (value) => setField('username', value)
                }
                error={errors.username}
                disabled={isLoading}
            />

            <InputField 
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder='비밀번호'
                value={formData.password}
                onChange = {
                    (value) => setField('password', value)
                }
                error={errors.password}
                disabled={isLoading}
                showToggle={true}
                onToggle={
                    () => setShowPassword(!showPassword)
                }
                toggleIcon={showPassword ? EyeOff : Eye}
            />

            <InputField 
                icon={Mail}
                type='email'
                placeholder='이메일 주소'
                value={formData.email}
                onChange={
                    (value) => setField('email', value)
                }
                error={errors.email}
                disabled={isLoading}
            />

            <InputField 
                icon={Phone}
                type='tel'
                placeholder='전화번호 (010-0000-0000)'
                value={formData.phone}
                onChange={
                    (value) => {
                        //g 전화번호 포맷
                        const formatted = value
                            .replace(/[^0-9]/g, '')
                            .replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
                            .replace(/^(\d{3})(\d{1,4})/, '$1-$2')
                            .replace(/^(\d{3}-\d{4})(\d{1,4})/, '$1-$2');
                            
                        setField('phone', formatted);
                    }
                }
                error={errors.phone}
                disabled={isLoading}
            /> 
        </motion.div>
    );
};