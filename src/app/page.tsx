'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkle } from 'lucide-react';
import { useSignUpCanProceed, useSignUpCurrentStep, useSignUpErrors, useSignUpLoading, useSignUpStepChanging, useSignUpStore } from '@/stores';
import { Step1, Step2, Step3 } from '@/components/signUp';

//g 단계벨 제목, 설명
const stepInfo = {
    1: {
        title: 'Welcome',
        desc: '기본 정보를 입력해주세요'
    },
    2: {
        title: 'About You', 
        desc: '당신에 대해 알려주세요'
    },
    3: {
        title: 'Connect', 
        desc: '소셜 계정을 연결해보세요' 
    }
}

export default function Home() {

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    //g 스토어 훅
    const currentStep = useSignUpCurrentStep();
    const isLoading = useSignUpLoading();
    const isStepChanging = useSignUpStepChanging();
    const canProceed = useSignUpCanProceed();
    const errors = useSignUpErrors();
    
    //g 스토어 셋
    const nextStep = useSignUpStore((state) => state.nextStep);
    const previousStep = useSignUpStore((state) => state.previousStep);
    const submitSignUp = useSignUpStore((state) => state.submitSignUp);

    //g 마우스 위치
    useEffect(() => {
        
        const mouseMove = (e: MouseEvent) => {

            setMousePos({ x: e.clientX, y: e.clientY });
        }
        
        window.addEventListener('mousemove', mouseMove);
        return () => window.removeEventListener('mousemove', mouseMove);
    }, []);

    //g 메인 폼 애니메이션
    const mainFormVariants = useMemo(() => ({
        inactive: {
            opacity: 0,
            scale: .8
        },
        active: {
            opacity: 1,
            scale: 1,
        }
    }), []);

    //g 폼 배경 애니메이션
    const formBgVariants = useMemo(() => ({
        active: {
            opacity: [.3, .5, .3],
            scale: [1, 1.1, 1]
        }
    }), []);

    //g 버튼 애니메이션
    const buttonVariants = useMemo(() => ({
        idle: {
            scale: 1
        },
        hover: { 
            scale: 1.05,
            transition: {
                duration: .2,
                ease: 'easeInOut' as const
            }
        },
        tap: {
            scale: .95
        }
    }), []);

    //g 단계별 컴포넌트 렌더링
    const renderCurrentStep = useMemo(() => {

        switch (currentStep) {
            
            default:
            case 1:
                return <Step1 />;
            
            case 2:
                return <Step2 />;
            
            case 3:
                return <Step3 />;
        }
    }, [currentStep]);

    //g 이전 단계
    const handlePrevious = async () => {
        await previousStep();
    };

    //g 다음 단계
    const handleNext = async () => {
        
        const success = await nextStep();
        
        if (!success) {
            
            //g 검증 실패 시 첫 번째 에러 필드로 포커스
            const firstErrorField = Object.keys(errors)[0];
            
            if (firstErrorField) {
              
                const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
                element?.focus();
            }
        }
    };

    //g 회원가입 제출
    const handleSubmit = async () => {
        
        const result = await submitSignUp();
        
        if (result.success) {

            //g 성공 시 알림
            alert('🎉 ' + result.message);

        } else {
          
            //g 실패 시 알림
            alert('❌ ' + result.message);
        }
    };

    return (
        <div
            className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden'
        >
            {/* 배경 */}
            <div
                className='absolute inset-0'
            >
                {/* 마우스 */}
                <motion.div 
                    className='absolute w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl'
                    style={{
                        left: mousePos.x - 192,
                        top: mousePos.y - 192
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [.4, .7, .4]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                {/* 그라데이션 */}
                <motion.div 
                    className='absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full filter blur-3xl'
                    animate={{
                        x: [0, 10, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl'
                    animate={{
                        x: [0, -10, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
            
            {/* 메인 폼 */}
            <motion.div
                className='relative w-full max-w-md'
                transition={{
                    duration: .5,
                    ease: 'easeOut',
                    staggerChildren: .1
                }}
                variants={mainFormVariants}
                initial='inactive'
                animate='active'
            >
                {/* 폼 배경 */}
                <motion.div
                    className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30'
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    variants={formBgVariants}
                    animate='active'
                />
                {/* 폼 카드 */}
                <motion.div
                    className='relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl'
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: .3 }}
                >
                    {/* 폼 헤더 */}
                    <motion.div
                        className='text-center mb-8'
                        initial={{
                            y: -20,
                            opacity: 0
                        }}
                        animate={{
                            y: 0,
                            opacity: 1
                        }}
                        transition={{ delay: .2 }}
                    >
                        {/* 헤더 아이콘 */}
                        <motion.div
                            className='flex justify-center mb-4'
                        >
                            <motion.div
                                className='p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl'
                                whileHover={{
                                    scale: 1.1 
                                }}
                            >
                                <motion.div
                                    whileHover={{
                                        rotate: 360
                                    }}
                                    transition={{
                                        duration: .5
                                    }}
                                >
                                    <Sparkle 
                                        className='w-8 h-8 text-white'
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* 헤더 타이틀 */}
                        <motion.h1
                            className='text-3xl font-bold text-white mb-2'
                            key={currentStep}
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: .4
                            }}
                        >
                            {stepInfo[currentStep as keyof typeof stepInfo].title}
                        </motion.h1>

                        {/* 헤더 설명 */}
                        <motion.p
                            className='text-gray-300'
                            key={`${currentStep}-desc`}
                            initial={{
                                opacity: 0,
                                y: 10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: .4,
                                delay: .1
                            }}
                        >
                            {stepInfo[currentStep as keyof typeof stepInfo].desc}
                        </motion.p>
                    </motion.div>
                    
                    {/* 단계 표시 */}
                    <motion.div
                        className='flex justify-center mb-8'
                        initial={{
                            opacity: 0,
                            scale: .8
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            delay: .3
                        }}
                    >
                        <div 
                            className='flex space-x-2'
                        >
                            {[1, 2, 3].map(num => (
                                <motion.div 
                                    key={num}
                                    className={`w-3 h-3 rounded-full ${
                                        num <= currentStep
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                            : 'bg-white/20'
                                    }`}
                                    initial={{
                                        scale: 0 
                                    }}
                                    animate={{
                                        scale: 1 
                                    }}
                                    transition={{
                                        delay: num * .1 + .3
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* 단계별 콘텐츠 */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{
                                opacity: 0,
                                x: 50
                            }}
                            animate={{
                                opacity: 1,
                                x: 0
                            }}
                            exit={{
                                opacity: 0, 
                                x: -50
                            }}
                            transition={{
                                duration: 0.4
                            }}
                        >
                            {renderCurrentStep}
                        </motion.div>
                    </AnimatePresence>

                    {/* 네비게이션 버튼 */}
                    <motion.div 
                        className='flex space-x-4 mt-8'
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            delay: .6
                        }}
                    >
                        {/* 이전 버튼 */}
                        <AnimatePresence>
                            {currentStep > 1 && (
                                <motion.button
                                    onClick={handlePrevious}
                                    disabled={isStepChanging || isLoading}
                                    className='flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all duration-300 flex items-center justify-center disabled:opacity-50'
                                    variants={buttonVariants}
                                    initial={{
                                        opacity: 0,
                                        x: -50
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -50
                                    }}
                                    whileHover='hover'
                                    whileTap='tap'
                                >
                                    <ArrowLeft className='w-5 h-5 mr-2' />
                                    이전
                                </motion.button>
                            )}
                        </AnimatePresence>
                        
                        {/* 다음, 완료 버튼 */}
                        {currentStep < 3 ? (
                            <motion.button
                                onClick={handleNext}
                                disabled={isStepChanging || isLoading || !canProceed}
                                className='flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50'
                                variants={buttonVariants}
                                whileHover={canProceed ? 'hover' : {}}
                                whileTap={canProceed ? 'tap' : {}}
                            >
                                {isStepChanging ? (
                                    <motion.div
                                        animate={{
                                            rotate: 360
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: 'linear'
                                        }}
                                        className='w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2'
                                    />
                                ) : (
                                    <>
                                        다음
                                        <ArrowRight className='w-5 h-5 ml-2' />
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={handleSubmit}
                                disabled={isLoading || !canProceed}
                                className='flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50'
                                variants={buttonVariants}
                                whileHover={canProceed ? 'hover' : {}}
                                whileTap={canProceed ? 'tap' : {}}
                            >
                            {isLoading ? (
                                <div className='flex items-center'>
                                    <motion.div
                                        animate={{
                                            rotate: 360
                                        }}
                                        transition={{
                                            duration: 1, 
                                            repeat: Infinity, 
                                            ease: 'linear' 
                                        }}
                                        className='w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2'
                                    />
                                    처리중...
                                </div>
                            ) : (
                                <motion.div 
                                    className='flex items-center'
                                    whileHover={{
                                        scale: 1.05
                                    }}
                                >
                                    <CheckCircle className='w-5 h-5 mr-2' />
                                    가입완료
                                </motion.div>
                            )}
                          </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}