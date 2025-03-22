export const generateOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateExpirationTime = (minutes: number = 1): Date => {
    return new Date(Date.now() + minutes * 60000);
};
