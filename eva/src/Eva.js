import { Environment } from './Environment.js';

export class Eva {
  #global;

  constructor(
    global = new Environment({
      false: false,
      true: true,
      VERSION: '0.1.0',
    })
  ) {
    this.#global = global;
  }

  eval = (exp, env = this.#global) => {
    if (this.#isNumber(exp)) {
      return exp;
    }

    if (this.#isString(exp)) {
      return exp.slice(1, -1);
    }

    if (this.#isNull(exp)) {
      return null;
    }

    if (this.#isBoolean(exp)) {
      return exp;
    }

    if (exp[0] === '+') {
      const [_, x, y] = exp;

      return this.eval(x, env) + this.eval(y, env);
    }

    if (exp[0] === '-') {
      const [_, x, y] = exp;

      return this.eval(x, env) - this.eval(y, env);
    }

    if (exp[0] === '*') {
      const [_, x, y] = exp;

      return this.eval(x, env) * this.eval(y, env);
    }

    if (exp[0] === '/') {
      const [_, x, y] = exp;

      return this.eval(x, env) / this.eval(y, env);
    }

    if (exp[0] === '%') {
      const [_, x, y] = exp;

      return this.eval(x, env) % this.eval(y, env);
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
      return this.#evalBlock(exp, blockEnv);
    }

    if (exp[0] === 'if') {
      const [_, condition, consequent, alternate] = exp;

      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }

      return this.eval(alternate, env);
    }

    if (exp[0] === 'while') {
      const [_, condition, block] = exp;
      let result = null;

      while (this.eval(condition, env)) {
        result = this.eval(block, env);
      }

      return result;
    }

    if (exp[0] === '>') {
      const [_, lhs, rhs] = exp;

      return (this.eval(lhs, env) ?? false) > (this.eval(rhs, env) ?? false);
    }

    if (exp[0] === '<') {
      const [_, lhs, rhs] = exp;

      return this.eval(lhs, env) < this.eval(rhs, env);
    }

    if (exp[0] === '>=') {
      const [_, lhs, rhs] = exp;

      return this.eval(lhs, env) >= this.eval(rhs, env);
    }

    if (exp[0] === '<=') {
      const [_, lhs, rhs] = exp;

      return this.eval(lhs, env) <= this.eval(rhs, env);
    }

    if (exp[0] === '==') {
      const [_, lhs, rhs] = exp;

      return this.eval(lhs, env) === this.eval(rhs, env);
    }

    if (exp[0] === '!=') {
      const [_, lhs, rhs] = exp;

      return this.eval(lhs, env) !== this.eval(rhs, env);
    }

    if (this.#isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplmented: ${JSON.stringify(exp)}`;
  };

  #isNumber = (exp) => typeof exp === 'number';

  #isString = (exp) =>
    typeof exp === 'string' && exp.at(0) === '"' && exp.slice(-1) === '"';

  #isNull = (exp) => exp === null;

  #isBoolean = (exp) => exp === true || exp === false;

  #isVariableName = (exp) =>
    typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);

  #evalBlock = (exp, env) => {
    const [_, ...expressions] = exp;

    return expressions
      .map((expression) => this.eval(expression, env))
      .at(expressions.length - 1);
  };
}
