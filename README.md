# Welcome to this delivery service exercise

## How to install

Just check out the code and install the dependencies (requires NodeJS):

```
npm install
```

## How to use

```
node delivery.js --help

delivery.js <cmd> [args]

Usage

Commands:
  delivery.js <cmd> [args]                  Usage                      [default]
  delivery.js routecost <route>             Computes the total distance of a
                                            route
  delivery.js shortest <from> <to>          Computes the shortest route between
                                            2 points
  delivery.js routes <from> <to> [maxHops]  Computes all possible routes
  [canRepeat]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Implementation notes

* The program makes heavy use of [lodash](https://lodash.com/) library to benefit from error handling and avoid too much boilerplate code for basic patterns.
* The shortest route computation algorithm is using a simple Dijkstra method, even though we could simply reuse the previously build methods to brute-list all the possible routes and select the shortest, since it was more fun to do. The downside is that the "same origin" scenarios aren't very elegantly handled.

## Answers to the exercises

```
yann$ node delivery.js routecost abe
4
yann$ node delivery.js routecost ad
10
yann$ node delivery.js routecost eacf
8
yann$ node delivery.js routecost adf
No Such Route
yann$ node delivery.js routes e d 4
Found 4 matching routes:
EAD
EACD
EACFD
EBEAD
yann$ node delivery.js routes e e
Found 5 matching routes:
EBE
EABE
EADE
EACDE
EACFDE
yann$ node delivery.js routes e e 20 true true
Found 29 matching routes:
EBE
EABE
EADE
EACDE
EBEBE
EABEBE
EACFDE
EADEBE
EBEABE
EBEADE
EABEABE
EABEADE
EACDEBE
EADEABE
EBEACDE
EBEBEBE
EABEACDE
EABEBEBE
EACDEABE
EACFDEBE
EBEABEBE
EBEACFDE
EBEBEABE
EABEABEBE
EABEACFDE
EABEBEABE
EACFDEABE
EBEABEABE
EABEABEABE
yann$ node delivery.js shortest e d
EACFD (9)
yann$ node delivery.js shortest e e
EABE (6)
```
