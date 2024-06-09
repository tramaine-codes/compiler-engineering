import type { Exp } from "./Eva.js";

export class Environment {
	constructor(private readonly record: Record<string, Exp> = {}) {}

	define = (name: string, value: Exp) => {
		this.record[name] = value;
		return value;
	};

	lookup = (name: string) => {
		if (!this.record[name]) {
			throw ReferenceError(`Variable "${name}" is not defined.`);
		}

		return this.record[name];
	};
}
