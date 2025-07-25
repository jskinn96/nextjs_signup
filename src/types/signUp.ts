export interface ISignUpFormData {
    //g Step 1: 기본 정보
    username: string;
    password: string;
    email: string;
    phone: string;
  
    //g Step 2: 개인 정보
    birthDate: string;
    gender: 'male' | 'female' | 'other' | undefined;
    nickname: string;
    interests: string;
  
    //g Step 3: SNS 연결
    facebook: string;
    instagram: string;
    github: string;
    agreeTerms: boolean;
    agreeMarketing: boolean;
}

export interface IFormErrors {
    [key: string]: string | undefined;
}

export interface ISignUpStoreState {
    formData: ISignUpFormData;
    errors: IFormErrors;
    currentStep: number;
    isLoading: boolean;
    isStepChanging: boolean;
}

export type TStepFields = {
    1: ('username' | 'password' | 'email' | 'phone')[];
    2: ('birthDate' | 'gender' | 'nickname')[];
    3: ('agreeTerms')[];
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: IFormErrors;
}
