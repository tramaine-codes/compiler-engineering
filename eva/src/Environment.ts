import type { Exp } from './Eva.js';

export class Environment {
  constructor(
    private readonly record: Record<string, Exp> = {},
    private readonly parent?: Environment
  ) {}

  define = (name: string, value: Exp) => {
    this.record[name] = value;
    return value;
  };

  lookup = (name: string) => {
    const { record } = this.resolve(name);
    return record[name];
  };

  assign = (name: string, value: Exp) => {
    const { record } = this.resolve(name);
    record[name] = value;
    return record[name];
  };

  private resolve = (name: string): Environment => {
    if (Object.hasOwn(this.record, name)) {
      return this;
    }

    if (this.parent === undefined) {
      throw ReferenceError(`Variable "${name}" is not defined.`);
    }

    return this.parent.resolve(name);
  };
}
