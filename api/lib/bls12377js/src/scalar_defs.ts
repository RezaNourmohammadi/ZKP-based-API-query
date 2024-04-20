import bigInt = require('big-integer')

export const Defs = {
  modulus: bigInt('8444461749428370424248824938781546531375899335154063827935233455917409239041'),
  nonresidue: bigInt('22'),
  quadraticNonresidue: [
    bigInt(0),
    bigInt(1),
  ],
  fByteSize: 32,
}

export interface FieldSpec<T> {
  equals(b: T): boolean
  add(b: T): T
  subtract(b: T): T
  multiply(b: T): T
  power(e: bigInt.BigInteger): T
  sqrt(): T
  inverse(): T
  negate(): T
  clone(): T
  toString(base?: number): string
}

export interface GroupSpec<T, G> {
  add(p2: G): G
  dbl(): G
  scalarMult(s: bigInt.BigInteger): G
  equals(p2: G): boolean
  toAffine(): G
  x(): T
  y(): T
  z(): T
  toString(base?: number): string
}
