export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyCode = (inputCode: string, actualCode: string): boolean => {
    return inputCode === actualCode;
};
