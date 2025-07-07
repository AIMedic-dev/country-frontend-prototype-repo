
// 📁 src/services/serviceAuthCode.ts
export async function sendVerificationCode(email: string): Promise<void> {
    const res = await fetch('https://emails-back-e8cnc6d5cwacfece.canadacentral-01.azurewebsites.net/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    const result = await res.json();               // <- { response: { data, error } }

    const backendError = result?.response?.error;  // puede ser null | string | undefined
    const hasError = !!backendError;               // verdadero solo si viene un mensaje de error

    if (!res.ok || hasError) {
        throw new Error(
            typeof backendError === 'string'
                ? backendError
                : 'Error desconocido al enviar el código'
        );
    }
}



export async function verifyCode(email: string, code: string): Promise<boolean> {
    const response = await fetch('https://emails-back-e8cnc6d5cwacfece.canadacentral-01.azurewebsites.net/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: Number(code) }), // 👈 conversión aquí
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Código inválido');
    }

    return true;
}
