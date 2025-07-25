import { create } from 'zustand';
import { ISignUpFormData, IFormErrors, ISignUpStoreState, TStepFields } from '@/types/signUp';
import { validateField, validateStep } from '@/lib/schemas';

interface ISignUpStore extends ISignUpStoreState {
    setField: <K extends keyof ISignUpFormData> (field: K, value: ISignUpFormData[K]) => void;
    nextStep: () => Promise <boolean>;
    previousStep: () => Promise <boolean>;
    setStep: (step: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (field: string, message: string) => void;
    clearError: (field: string) => void;
    clearAllErrors: () => void;
    reset: () => void;
    submitSignUp: () => Promise <{
        success: boolean;
        message: string;
    }>;
    validateCurrentStep: () => boolean;

    isStepValid: boolean;
    progress: number;
}

//g 초기 상태
const initialFormData: ISignUpFormData = {
    //g Step 1
    username: '',
    password: '',
    email: '',
    phone: '',

    //g Step 2
    birthDate: '',
    gender: undefined,
    nickname: '',
    interests: '',

    //g Step 3
    facebook: '',
    instagram: '',
    github: '',
    agreeTerms: false,
    agreeMarketing: false,
};

//g 각 단계별 필수 필드
const stepFields: TStepFields = {
    1: ['username', 'password', 'email', 'phone'],
    2: ['birthDate', 'gender', 'nickname'],
    3: ['agreeTerms'],
};

export const useSignUpStore = create<ISignUpStore>()((set, get) => ({
    formData: initialFormData,
    errors: {},
    currentStep: 1,
    isLoading: false,
    isStepChanging: false,

    setField: <K extends keyof ISignUpFormData> (field: K, value: ISignUpFormData[K]) => {
        
        set(state => ({
            formData: {
                ...state.formData,
                [field]: value,
            },
        }));

        //g 검증
        const currentStep = get().currentStep;
        const result = validateField(field as K, value, currentStep);
        
        if (result.success) {

            set((state) => {
                const newErrors = { ...state.errors };
                delete newErrors[field as K];
                return {
                    errors: newErrors
                };
            });
            
        } else if (!result.success && 'error' in result) {

            set((state) => ({
                errors: {
                    ...state.errors,
                    [field as string]: result.error.issues[0]?.message || '유효하지 않은 값입니다',
                },
            }));
        }
    },

    validateCurrentStep: () => {
        
        const state = get();
        const fieldsToValidate = stepFields[state.currentStep as keyof typeof stepFields];

        //g 개별 검증
        let isValid = true;
        const newErrors: IFormErrors = { ...state.errors };

        fieldsToValidate.forEach(field => {

            const value = state.formData[field];
            const result = validateField(field, value, state.currentStep);

            if (!result.success && 'error' in result && result.error) {

                newErrors[field] = result.error.issues[0]?.message || '유효하지 않은 값입니다';
                isValid = false;

            } else {

                delete newErrors[field];
            }
        });

        //g 통합 검증
        const stepData = getStepData(state.currentStep, state.formData);
        const stepResult = validateStep(state.currentStep, stepData);

        if (!stepResult.success && stepResult.error && 'issues' in stepResult.error) {
            
            stepResult.error.issues.forEach(issue => {
                
                if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
            });

            isValid = false;
        }

        set({
            errors: newErrors
        });
        
        return isValid;
    },

    nextStep: async () => {
        
        const isValid = get().validateCurrentStep();

        if (!isValid) return false;
        
        const currentStep = get().currentStep;
        if (currentStep >= 3) return false;
        
        set({
            isStepChanging: true
        });

        //g 애니메이션 딜레이
        await new Promise(resolve => setTimeout(resolve, 300));

        set({
            currentStep: currentStep + 1,
            isStepChanging: false,
        });

        return true;
    },

    previousStep: async () => {
        
        const currentStep = get().currentStep;
        if (currentStep <= 1) return false;
        
        set({
            isStepChanging: true
        });

        //g 애니메이션 딜레이
        await new Promise(resolve => setTimeout(resolve, 300));

        set({
            currentStep: currentStep - 1,
            isStepChanging: false,
        });

        return true;
    },

    setStep: (step: number) => {
        
        if (step >= 1 && step <= 3) {

            set({
                currentStep: step
            });
        }
    },

    setLoading: (loading: boolean) => {

        set({
            isLoading: loading
        });
    },

    setError: (field: string, message: string) => {
        
        set((state) => ({
            errors: {
                ...state.errors,
                [field]: message,
            },
        }));
    },

    clearError: (field: string) => {

        set((state) => {
            const newErrors = {
                ...state.errors
            };
            delete newErrors[field];
            return {
                errors: newErrors
            };
        });
    },

    clearAllErrors: () => {
        set({
            errors: {}
        });
    },

    reset: () => {
        set({
            formData: initialFormData,
            errors: {},
            currentStep: 1,
            isLoading: false,
            isStepChanging: false,
        });
    },

    //g 최종 검증
    submitSignUp: async () => {
        const state = get();

        if (!state.validateCurrentStep()) {
            
            return {
                success: false,
                message: '입력 정보를 확인해주세요'
            };
        }

        if (!state.formData.agreeTerms) {
            
            get().setError('agreeTerms', '이용약관에 동의해야 합니다');
            
            return {
                success: false,
                message: '이용약관에 동의해주세요'
            };
        }

        //todo 백단 처리 필요
        get().setLoading(true);
        
        get().reset();
        return {
            success: true,
            message: '회원가입이 완료되었습니다!'
        };
    },

    get isStepValid() {

        const state = get();
        const fields = stepFields[state.currentStep as keyof typeof stepFields];
        
        return fields.every(field =>
            state.formData[field] && !state.errors[field]
        );
    },

    get progress() {

        return (get().currentStep / 3) * 100;
    }
}));

//g 단계별 데이터 추출
function getStepData<T extends keyof ISignUpFormData>(step: number, formData: ISignUpFormData) {

    const fields = stepFields[step as keyof typeof stepFields];
    const stepData: Partial<ISignUpFormData> = {};

    fields.forEach(field => {
        stepData[field as T] = formData[field as T];
    });

    return stepData;
}

//g 커스텀 훅
export const useSignUpFormData = () => useSignUpStore((state) => state.formData);
export const useSignUpErrors = () => useSignUpStore((state) => state.errors);
export const useSignUpCurrentStep = () => useSignUpStore((state) => state.currentStep);
export const useSignUpLoading = () => useSignUpStore((state) => state.isLoading);
export const useSignUpStepChanging = () => useSignUpStore((state) => state.isStepChanging);

export const useSignUpCanProceed = () => {
    return useSignUpStore((state) => {
        const fields = stepFields[state.currentStep as keyof typeof stepFields];
        const isStepValid = fields.every(field =>
            state.formData[field] && !state.errors[field]
        );
        
        return isStepValid && !state.isLoading && !state.isStepChanging;
    });
};