export function debounce(delay) {
    const debounceInner = (func, t) => {
        let inDebounce;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), t);
        };
    };

    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // target是prototype
        descriptor.value = debounceInner(descriptor.value, delay);
    };
}
