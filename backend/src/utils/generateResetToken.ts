export function generateResetToken() {
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    return { resetToken, resetTokenExpiry };
}