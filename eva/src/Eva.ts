import { Environment } from "./Environment.js";

export type Exp = MathExp | string | Assign | Bool | null;
type MathExp = number | Add | Sub | Mult | Div | Mod;
type Add = ["+", MathExp, MathExp];
type Sub = ["-", MathExp, MathExp];
type Mult = ["*", MathExp, MathExp];
type Div = ["/", MathExp, MathExp];
type Mod = ["%", MathExp, MathExp];
type Assign = ["var", string, Exp];
type Bool = true | false;

export class Eva {
	constructor(
		private readonly global = new Environment({
			false: false,
			null: null,
			true: true,
			VERSION: "0.1.0",
		}),
	) {}

	eval = (exp: Exp, env = this.global): Exp => {
		if (isNumber(exp)) {
			return exp;
		}

		if (isString(exp)) {
			return exp.slice(1, -1);
		}

		if (isNull(exp)) {
			return null;
		}

		if (isBoolean(exp)) {
			return exp;
		}

		if (exp[0] === "+") {
			const [_, x, y] = exp;

			return (this.eval(x) as number) + (this.eval(y) as number);
		}

		if (exp[0] === "-") {
			const [_, x, y] = exp;

			return (this.eval(x) as number) - (this.eval(y) as number);
		}

		if (exp[0] === "*") {
			const [_, x, y] = exp;

			return (this.eval(x) as number) * (this.eval(y) as number);
		}

		if (exp[0] === "/") {
			const [_, x, y] = exp;

			return (this.eval(x) as number) / (this.eval(y) as number);
		}

		if (exp[0] === "%") {
			const [_, x, y] = exp;

			return (this.eval(x) as number) % (this.eval(y) as number);
		}

		if (exp[0] === "var") {
			const [_, name, value] = exp;

			return env.define(name, this.eval(value));
		}

		if (isVariableName(exp)) {
			return env.lookup(exp);
		}

		throw `Unimplmented: ${JSON.stringify(exp)}`;
	};
}

const isNumber = (exp: unknown): exp is number => typeof exp === "number";

const isString = (exp: unknown): exp is string =>
	typeof exp === "string" && exp.at(0) === '"' && exp.slice(-1) === '"';

const isNull = (exp: unknown): exp is null => exp === null;

const isBoolean = (exp: unknown): exp is boolean =>
	exp === true || exp === false;

const isVariableName = (exp: unknown): exp is string =>
	typeof exp === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
