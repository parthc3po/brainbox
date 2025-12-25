import { SimpleCrypto } from '../lib/crypto';

describe('SimpleCrypto Utility', () => {
  const secret = "HELLO WORLD";
  const key = "KEY";

  it('should encrypt data differently than input', () => {
    const encrypted = SimpleCrypto.encrypt(secret, key);
    expect(encrypted).not.toBe(secret);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should decrypt data back to original', () => {
    const encrypted = SimpleCrypto.encrypt(secret, key);
    const decrypted = SimpleCrypto.decrypt(encrypted, key);
    expect(decrypted).toBe(secret);
  });

  it('should fail to decrypt with wrong key', () => {
    const encrypted = SimpleCrypto.encrypt(secret, key);
    const decrypted = SimpleCrypto.decrypt(encrypted, "WRONG");
    expect(decrypted).not.toBe(secret);
  });
});
