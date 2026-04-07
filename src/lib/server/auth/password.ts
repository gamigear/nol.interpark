import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

/**
 * Password hashing utilities using scrypt (Node.js built-in).
 *
 * Format: {algorithm}:{iterations}:{salt}:{hash}
 * Example:  scrypt:32768:abc123...:def456...
 *
 * This is a foundation — for production, consider bcrypt or argon2.
 */

const ALGORITHM = 'scrypt';
const KEY_LENGTH = 64;
const COST_FACTOR = 32768; // N parameter for scrypt

function encodeBuffer(buf: Buffer): string {
  return buf.toString('hex');
}

function decodeBuffer(hex: string): Buffer {
  return Buffer.from(hex, 'hex');
}

/**
 * Hash a plaintext password. Returns a string in the format:
 * {algorithm}:{cost}:{salt}:{hash}
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N: COST_FACTOR }, (err, derivedKey) => {
      if (err) return reject(err);
      const hash = encodeBuffer(derivedKey);
      const saltHex = encodeBuffer(salt);
      resolve(`${ALGORITHM}:${COST_FACTOR}:${saltHex}:${hash}`);
    });
  });
}

/**
 * Verify a plaintext password against a stored hash.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 4) return false;

    const [algorithm, costStr, saltHex, hashHex] = parts;
    if (algorithm !== ALGORITHM) return false;

    const cost = parseInt(costStr, 10);
    if (Number.isNaN(cost)) return false;

    const salt = decodeBuffer(saltHex);
    const expectedHash = decodeBuffer(hashHex);

    return new Promise((resolve, reject) => {
      scrypt(password, salt, KEY_LENGTH, { N: cost }, (err, derivedKey) => {
        if (err) return reject(err);
        const valid =
          derivedKey.length === expectedHash.length &&
          timingSafeEqual(derivedKey, expectedHash);
        resolve(valid);
      });
    });
  } catch {
    return false;
  }
}
