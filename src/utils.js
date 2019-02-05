export function observe(obj, key, initial, callback = () => {}) {
    let value = initial;
    
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(val) {
            value = val;
            callback(val);
        }
    });
}

export function wrapperElapsed(func, post) {
    return async function() {
        const t = window.performance.now();

        await func.apply(this, arguments);

        await post(window.performance.now() - t, ...arguments);
    }
}