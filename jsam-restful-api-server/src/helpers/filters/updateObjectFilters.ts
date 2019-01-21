import dot from 'dot-object';

const getNullFilteredObject = (obj: object) => {
  const nullFilteredObject = { ...obj };
  const keys = Object.keys(nullFilteredObject);

  keys.forEach(key => {
    if (!nullFilteredObject[key]) {
      delete nullFilteredObject[key];
    }
  });

  return nullFilteredObject;
};

const getDotifiedObject = (obj: object) => {
  return dot.dot(obj);
};

const getNullFilteredAndDotifiedObject = (obj: object) => getDotifiedObject(getNullFilteredObject(obj));

export { getNullFilteredObject, getDotifiedObject, getNullFilteredAndDotifiedObject };

export default getNullFilteredAndDotifiedObject;
