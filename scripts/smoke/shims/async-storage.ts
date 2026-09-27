/** In-memory AsyncStorage stand-in so the store can run headless under Node. */
const mem = new Map<string, string>();

export default {
  async getItem(key: string) {
    return mem.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    mem.set(key, value);
  },
  async removeItem(key: string) {
    mem.delete(key);
  },
};
