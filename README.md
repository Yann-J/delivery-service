# Welcome to this delivery service exercise

## How to install

Just check out the code and install the dependencies (requires NodeJS):

```
git clone https://github.com/yannouchou/delivery-service.git
cd delivery-service
npm install
node delivery.js help
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

## How to test

1. Install the dev dependencies: `npm intall --dev`
1. `npm test`

You should see all passing tests:
```
C:\Users\yjouanique\Dev\delivery-service>npm test

> delivery-service@1.0.0 test C:\Users\yjouanique\Dev\delivery-service
> mocha



  Graph
    routeCost
      √ should return 4 for route ABE
      √ should return 10 for route AD
      √ should return 8 for route EACF
      √ should not find a route for ADF
    allRoutes
      √ should find 4 routes from E to D with less than 4 hops without repeating hops
      √ should find 11 routes from E to E without repeating hops
      √ should find 29 routes from E to E costing less than 20
    shortestRoute
      √ should find a shortest route of 9 from E to D
      √ should find a shortest route of 6 from E to E


  9 passing (11ms)
```

## Implementation notes

* The program makes heavy use of [lodash](https://lodash.com/) library to benefit from error handling and avoid too much boilerplate code for basic patterns.
* The shortest route computation algorithm is using a simple Dijkstra method, even though we could simply reuse the previously build methods to brute-list all the possible routes and select the shortest. It was simply more fun to do. The downside is that the "same origin" scenarios aren't very elegantly handled with this algorithm...
* **IMPORTANT**: the condition *"without​ ​using​ ​the​ ​same​ ​route​ ​twice​ ​in​ ​a​ ​delivery​ ​route"* is interpreted as *"without travelling the same **graph vertice** twice"*. It means that the program will allow routes going multiple times through the same **graph node** (=town) as long as we never repeat a previously made hop. We think this interpretation is is more faithful to the exercise wording, and in practice a more realistic condition, as passing through the same town twice is a perfectly plausible route for some constraints, e.g. if we need to pass through one specific town X that is only reachable with a return loop from another town Y - although obviously such a route will never be an optimal route for a given from/to combination. This is probably why one answer differs from the exercise example, as the program finds 11 non-trivial routes from E to E as follows:
** EBE
** EABE
** EADE
** EACDE
** EACFDE
** EADEBE
** EBEADE
** EACDEBE
** EBEACDE
** EACFDEBE
** EBEACFDE

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
Found 11 matching routes:
EBE
EABE
EADE
EACDE
EACFDE
EADEBE
EBEADE
EACDEBE
EBEACDE
EACFDEBE
EBEACFDE

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
