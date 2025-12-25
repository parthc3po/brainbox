export const SimpleCrypto = {
  // Simple Vigenère Cipher
  encrypt: (text, key) => {
    if (!key) return text;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      // XOR for simple reversible encryption
      // Store as hex to make it "string safe"
      const encryptedChar = (charCode ^ keyChar).toString(16).padStart(2, '0');
      result += encryptedChar;
    }
    return result;
  },

  decrypt: (encryptedHex, key) => {
    if (!key) return encryptedHex;
    let result = '';
    try {
      for (let i = 0; i < encryptedHex.length; i += 2) {
        const hex = encryptedHex.substr(i, 2);
        const charCode = parseInt(hex, 16);
        const keyChar = key.charCodeAt((i / 2) % key.length);
        result += String.fromCharCode(charCode ^ keyChar);
      }
    } catch (e) {
      return "DECRYPTION FAILED";
    }
    return result;
  }
};
