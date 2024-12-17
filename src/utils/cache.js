class SSRCache {
    constructor() {
      this.cache = new Map();
    }
  
    // Generate a cache key based on component name and props
    generateKey(name, props) {
      return `${name}-${JSON.stringify(props)}`;
    }
  
    // Check if a cached value exists
    get(component, props) {
      const key = this.generateKey(component.constructor.name, props);
      return this.cache.get(key);
    }
  
    // Set a cached value
    set(component, props, output) {
      const key = this.generateKey(component.constructor.name, props);
      this.cache.set(key, output);
    }
  
    // Clear the cache (for testing or debugging)
    clear() {
      this.cache.clear();
    }
  }
  
  module.exports = new SSRCache();