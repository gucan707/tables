export const deepClone = (
  obj: Record<string, any>,
  newObj: Record<string, any>
) => {
  const map = new WeakMap();

  const _deepClone = (
    obj: Record<string, any>,
    newObj: Record<string, any>
  ) => {
    for (const key in obj) {
      if (!(obj[key] instanceof Object)) {
        newObj[key] = obj[key];
        continue;
      }

      if (typeof obj[key] === "function" || typeof obj[key] === "symbol") {
        newObj[key] = obj[key];
        continue;
      }

      if (map.has(obj[key])) {
        newObj[key] = obj[key];
        continue;
      }
      map.set(obj[key], 1);

      if (Array.isArray(obj[key])) {
        newObj[key] = [];
        _deepClone(obj[key], newObj[key]);
      } else {
        newObj[key] = {};
        _deepClone(obj[key], newObj[key]);
      }
    }
  };

  _deepClone(obj, newObj);
};
