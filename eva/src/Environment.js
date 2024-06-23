export class Environment {
  constructor(record = {}, parent = undefined) {
    this.record = record;
    this.parent = parent;
  }

  define = (name, value) => {
    this.record[name] = value;
    return value;
  };

  lookup = (name) => this.resolve(name).record[name];

  assign = (name, value) => {
    const { record } = this.resolve(name);
    record[name] = value;
    return record[name];
  };

  resolve = (name) => {
    if (Object.hasOwn(this.record, name)) {
      return this;
    }

    if (this.parent === undefined) {
      throw ReferenceError(`Variable "${name}" is not defined.`);
    }

    return this.parent.resolve(name);
  };
}
