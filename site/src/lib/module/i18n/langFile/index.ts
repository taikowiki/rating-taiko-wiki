export function preventUndefined(obj: RecursiveStringObject): RecursiveStringObject {
    const emptyStringObject = new Proxy({}, {
        get(target, p, receiver) {
            if (p === "toString" || p === Symbol.toPrimitive) {
                return () => "";
            }
            const value = Reflect.get(target, p, receiver);
            if (typeof (value) === "undefined") {
                return emptyStringObject;
            }
            return value;
        }
    })

    function proxify(obj: RecursiveStringObject) {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof (value) === "object") {
                obj[key] = proxify(value);
            }
        });
        return new Proxy(obj, {
            get(target, p, receiver) {
                const value = Reflect.get(target, p, receiver);
                if (typeof (value) === "undefined") return emptyStringObject;
                return value;
            }
        });
    }

    return proxify(obj);
}
interface RecursiveStringObject {
    [key: string]: any;
}

import { ko } from "./ko";
import { en } from './en';
import { ja } from './ja';

export const i18n = preventUndefined({
    ko,
    en,
    ja
})