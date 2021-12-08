import path from "path";

function jsonParser (jsonStr : string) : string | null {
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    return null;
  }
}
type ObjToMap = {
  [key : string] : unknown
};

// 尚未测试，且有可能造成any污染
function objToMap<K, V> (obj : ObjToMap) : Map<K, V> {
  const map = new Map();
  Object.keys(obj).forEach((v, k) => {
    map.set(k, v);
  });
  return map;
}

function mapToObj<K, V> (map : Map<K, V>) : ObjToMap {
  const obj = Object.create(null);
  for (const [ k, v ] of map) {
    obj[ k ] = v;
  }
  return obj;
}

function mapStringify<K, V> (map : Map<K, V>) : string | null {
  try {
    return JSON.stringify(mapToObj(map));
  } catch (error) {
    return null;
  }
}

function getPath (dir = "") : string {
  return path.join(__dirname, "../../" + dir);
}

export {
  jsonParser,
  mapStringify,
  mapToObj,
  objToMap,
  getPath,
};
