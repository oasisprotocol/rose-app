#!/usr/bin/env python3
from z3 import Function, Solver, IntSort, Int, ToReal, BitVec, BitVecSort, BV2Int, ToReal, ToInt

s = Solver()
f = Function('f(totalROSE,totalShares,userROSE)',
            BitVecSort(128), BitVecSort(128), BitVecSort(128), BitVecSort(128))

#s.add(f(0,0,0) == 0)
#s.add(f(0,0,1) == 1)

totalROSE = BitVec('totalROSE', 128)
totalShares = BitVec('totalShares', 128)
userROSE = BitVec('userROSE', 128)
userShares = BitVec('userShares', 128)

s.add(totalROSE > 0, totalROSE <= (2**128))
s.add(totalShares > 0, totalShares <= (2**128))
s.add(userROSE > 0, userROSE <= (2**128))
s.add(userShares > 0)

s.add(f(totalROSE,totalShares,userROSE) == userShares)

newTotalROSE = totalROSE + userROSE
newTotalShares = totalShares + userShares

dorp = BV2Int(newTotalROSE)
morp = BV2Int(newTotalShares)
zorp = BV2Int(userShares)
forp = BV2Int(userROSE)
s.add((ToReal(dorp)/ToReal(morp)) * ToReal(zorp) == ToInt(forp))

s.check()
m = s.model()
print(m)
