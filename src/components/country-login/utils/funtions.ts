import Cookies from 'js-cookie';


// export const saveTokenToCookie = (token: string): void => {
//     // Obtiene la fecha de expiración del token
//     const expDate = getExpirationDateFromToken(token);

//     Cookies.set('access_token', token, {
//         expires: new Date(expDate),
//         secure: true,
//         sameSite: 'None',
//         domain: '.aimedic.com.co',
//     });
// };


// export const getExpirationDateFromToken = (token: string): number => {
//     // Verifica si el token es válido y si tiene la estructura correcta
//     if (!token || token.split('.').length !== 3) {
//         throw new Error('Token inválido');
//     }

//     // Decodifica el token y obtiene la fecha de expiración
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//         atob(base64)
//             .split('')
//             .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
//             .join('')
//     );

//     const payload: { exp: number } = JSON.parse(jsonPayload);

//     // Verifica si el campo exp está presente y es un número
//     if (!payload.exp || typeof payload.exp !== 'number') {
//         // Lanza un error si el campo exp no está presente o es inválido
//         throw new Error('El campo exp no está presente o es inválido en el token');
//     }
//     return payload.exp * 1000;
// };