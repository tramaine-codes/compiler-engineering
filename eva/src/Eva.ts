import { Environment } from './Environment.js';

export type Exp = MathExp | Bool | Str | Var | Assign | Block | Null;
type MathExp = Add | Sub | Mult | Div | Mod | Num | Ident;
type Add = ['+', MathExp, MathExp];
type Sub = ['-', MathExp, MathExp];
type Mult = ['*', MathExp, MathExp];
type Div = ['/', MathExp, MathExp];
type Mod = ['%', MathExp, MathExp];
type Num = number;
type Ident = string;
type Bool = true | false;
type Str = string;
type Var = ['var', string, Exp];
type Assign = ['set', string, Exp];
type Block = ['begin', Exp, ...Exp[]];
type Null = null;

export class Eva {
  constructor(
    private readonly global = new Environment({
      false: false,
      null: null,
      true: true,
      VERSION: '0.1.0',
    })
  ) {}

  eval = (exp: Exp, env = this.global): Exp => {
    if (this.isNumber(exp)) {
      return exp;
    }

    if (this.isString(exp)) {
      return exp.slice(1, -1);
    }

    if (this.isNull(exp)) {
      return null;
    }

    if (this.isBoolean(exp)) {
      return exp;
    }

    if (exp[0] === '+') {
      const [_, x, y] = exp;

      return (this.eval(x, env) as number) + (this.eval(y, env) as number);
    }

    if (exp[0] === '-') {
      const [_, x, y] = exp;

      return (this.eval(x, env) as number) - (this.eval(y, env) as number);
    }

    if (exp[0] === '*') {
      const [_, x, y] = exp;

      return (this.eval(x, env) as number) * (this.eval(y, env) as number);
    }

    if (exp[0] === '/') {
      const [_, x, y] = exp;

      return (this.eval(x, env) as number) / (this.eval(y, env) as number);
    }

    if (exp[0] === '%') {
      const [_, x, y] = exp;

      return (this.eval(x, env) as number) % (this.eval(y, env) as number);
    }

    if (exp[0] === 'var') {
      const [_, name, value] = exp;

      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === 'set') {
      const [_, name, value] = exp;

      return env.assign(name, this.eval(value, env));
    }

    if (exp[0] === 'begin') {
      const blockEnv = new Environment({}, env);
      return this.evalBlock(exp, blockEnv);
    }

    if (this.isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplmented: ${JSON.stringify(exp)}`;
  };

  private isNumber = (exp: unknown): exp is number => typeof exp === 'number';

  private isString = (exp: unknown): exp is string =>
    typeof exp === 'string' && exp.at(0) === '"' && exp.slice(-1) === '"';

  private isNull = (exp: unknown): exp is null => exp === null;

  private isBoolean = (exp: unknown): exp is boolean =>
    exp === true || exp === false;

  private isVariableName = (exp: unknown): exp is string =>
    typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);

  private evalBlock = (exp: Block, env: Environment) => {
    const [_, ...expressions] = exp;
    let result: Exp = null;

    for (const expression of expressions) {
      result = this.eval(expression, env);
    }

    return result;
  };
}
