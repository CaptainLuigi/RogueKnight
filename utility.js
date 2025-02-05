function getAllGetters(instance) {
  const getters = {};

  // Get all properties in the prototype chain
  let proto = Object.getPrototypeOf(instance);

  while (proto) {
    // Get all property descriptors for this prototype level
    const descriptors = Object.getOwnPropertyDescriptors(proto);

    // Find all getter methods (i.e., those with 'get' in the descriptor)
    for (let key in descriptors) {
      if (descriptors[key].get) {
        let getter = descriptors[key].get;
        if (!(key in getters)) getters[key] = getter;
      }
    }

    // Move to the next prototype (in case the class extends another class)
    proto = Object.getPrototypeOf(proto);
  }

  delete getters["__proto__"];
  return getters;
}
