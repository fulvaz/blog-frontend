export function loading(loadingKeyName = 'ifLoading'): any {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // target是prototype
    const origin = target[propertyKey];
    descriptor.value = async function(...args) {
      this.setState({
        [loadingKeyName]: true
      });
      try {
        const res = await origin.apply(this, args);
        this.setState({
          [loadingKeyName]: false
        });
        return res;
      } catch (e) {
        this.setState({
          [loadingKeyName]: false
        });
        throw e;
      }
    };
  };
}
