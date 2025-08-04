import { ISignUpFormData } from '@/types';
import { z } from 'zod';

//g Step 1: 기본 정보 스키마
export const step1Schema = z.object({
    username: z
        .string()
        .min(3, '아이디는 3자 이상이어야 합니다')
        .max(20, '아이디는 20자 이하여야 합니다')
        .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, _만 사용 가능합니다'),

    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다')
        .max(50, '비밀번호는 50자 이하여야 합니다')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다')
        .regex(/^(?=.*[!@#$%^&*])/, '특수문자를 포함해야 합니다'),

    email: z
        .email('올바른 이메일 형식이 아닙니다'),

    phone: z
        .string()
        .regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력해주세요')
});

//g Step 2: 개인 정보 스키마
export const step2Schema = z.object({
    birthDate: z
        .string()
        .min(1, '생년월일을 선택해주세요')
        .refine((date) => {
            const birthYear = new Date(date).getFullYear();
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            return age >= 14 && age <= 120;
        }, '14세 이상만 가입 가능합니다'),

    gender: z
        .enum(['male', 'female', 'other'], {
            message: '성별을 선택해주세요'
        }),

    nickname: z
        .string()
        .min(2, '닉네임은 2자 이상이어야 합니다')
        .max(15, '닉네임은 15자 이하여야 합니다')
        .regex(/^[a-zA-Z0-9가-힣_]+$/, '한글, 영문, 숫자, _만 사용 가능합니다'),

    interests: z
        .string()
        .optional()
});

//g Step 3: SNS 연결 스키마
export const step3Schema = z.object({
    facebook: z
        .string()
        .optional()
        .refine((handle) => {
            if (!handle) return true;
            return /^[a-zA-Z0-9._]+$/.test(handle);
        }, '올바른 Facebook 계정명을 입력해주세요'),

    instagram: z
        .string()
        .optional()
        .refine((handle) => {
            if (!handle) return true;
            return /^[a-zA-Z0-9._]+$/.test(handle);
        }, '올바른 Instagram 계정명을 입력해주세요'),

    github: z
        .string()
        .optional()
        .refine((handle) => {
            if (!handle) return true;
            return /^[a-zA-Z0-9-]+$/.test(handle);
        }, '올바른 GitHub 계정명을 입력해주세요'),

    agreeTerms: z
        .boolean()
        .refine((val) => val === true, '이용약관에 동의해야 합니다'),

    agreeMarketing: z
        .boolean()
        .optional()
});

//g 전체 폼
export const signUpSchema = step1Schema
    .extend(step2Schema.shape)
    .extend(step3Schema.shape);

//g 타입 추론
export type TStep1Data = z.infer<typeof step1Schema>;
export type TStep2Data = z.infer<typeof step2Schema>;
export type TStep3Data = z.infer<typeof step3Schema>;
export type TSignUpData = z.infer<typeof signUpSchema>;

//g 검증
export const validateStep = (step: number, data: Partial<TSignUpData>) => {

    switch (step) {
        
        case 1:
            return step1Schema.safeParse(data);

        case 2:
            return step2Schema.safeParse(data);

        case 3:
            return step3Schema.safeParse(data);

        default:
            return {
                success: false, 
                error: {
                    issues: []
                }
            };
    }
};

//g 필드별 검증
export const validateField = <K extends keyof ISignUpFormData>(fieldName: K, value: ISignUpFormData[K], step: number) => {

    const schema = 
        step === 1 ? step1Schema 
        : step === 2 ? step2Schema 
        : step3Schema;

    const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape] as z.ZodTypeAny;

    if (!fieldSchema) return {
        success: true
    };

    return fieldSchema.safeParse(value);
};