export const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return { code, expiresAt };
};

export const verifyCode = (inputCode: string, userCode: string, expiresAt: Date | null) => {
    if (!userCode || !expiresAt) return false;
    const now = new Date();
    if (now > expiresAt) return false;
    return inputCode === userCode;
};
