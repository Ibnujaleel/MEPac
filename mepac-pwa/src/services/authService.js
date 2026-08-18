/**
 * Auth service — Connected to Convex backend.
 */
import { convexClient, api } from '../convex.js';

/**
 * Login with 10-digit phone number and 6-digit PIN.
 * @param {string} phone – 10-digit mobile number
 * @param {string} pin   – 6-digit PIN
 * @returns {Promise<{ user: object, role: string }>}
 */
export async function login(phone, pin) {
  const normalizedPhone = phone.replace(/\D/g, '');
  return await convexClient.mutation(api.workers.loginWithPin, {
    mobile: normalizedPhone,
    pin,
  });
}

/**
 * Change worker PIN.
 * @param {string} workerId
 * @param {string} oldPin
 * @param {string} newPin
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function changePin(workerId, oldPin, newPin) {
  return await convexClient.mutation(api.workers.changePin, {
    workerId,
    oldPin,
    newPin,
  });
}

/**
 * Logout.
 * @returns {Promise<void>}
 */
export async function logout() {
  // Clear any local caches if needed
}
