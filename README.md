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
$ node delivery.js --help

delivery.js <command>

Commands:
  delivery.js routecost <route>             Computes the total distance of a
                                            route
  delivery.js shortest <from> <to>          Computes the shortest route between
                                            2 points
  delivery.js routes <from> <to> [max]      Computes all possible routes
  [distance] [canRepeat]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

Specific options for the route list command:

```
$ node delivery.js routes

delivery.js routes <from> <to> [max] [distance] [canRepeat]

Computes all possible routes

Positionals:
  from       FROM node name                                  [string] [required]
  to         TO node name                                    [string] [required]
  max        Maximum                                                    [number]
  distance   Interpret maximum value as total route distance instead of number
             of hops                                                   [boolean]
  canRepeat  Allow revisiting previous nodes?                          [boolean]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Not enough non-option arguments: got 0, need at least 2
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

* While this exercise is implemented as a CLI, the core logic is isolated from the CLI input/display logic into a separate module that would be reusable in a server flavor.
* The program makes heavy use of [lodash](https://lodash.com/) library to benefit from error handling and avoid too much boilerplate code for basic patterns.
* The shortest route computation algorithm is using a simple Dijkstra method, even though we could simply reuse the previously build methods to brute-list all the possible routes and select the shortest. It was simply more fun to do. The downside is that the "same origin" scenarios aren't very elegantly handled with this algorithm...
* **IMPORTANT**: the condition *"without​ ​using​ ​the​ ​same​ ​route​ ​twice​ ​in​ ​a​ ​delivery​ ​route"* is interpreted as *"without travelling the same **graph vertice** twice"*. It means that the program will allow routes going multiple times through the same **graph node** (=town) as long as we never repeat a previously made hop. We think this interpretation is is more faithful to the exercise wording, and in practice a more realistic condition, as passing through the same town twice is a perfectly plausible route for some constraints, e.g. if we need to pass through one specific town X that is only reachable with a return loop from another town Y - although obviously such a route will never be an optimal route for a given from/to combination. This is probably why one answer differs from the exercise example, as the program finds 11 non-trivial routes from E to E as follows:
  * EBE
  * EABE
  * EADE
  * EACDE
  * EACFDE
  * EADEBE
  * EBEADE
  * EACDEBE
  * EBEACDE
  * EACFDEBE
  * EBEACFDE

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
EAD (12)
EACD (10)
EACFD (9)
EBEAD (18)

yann$ node delivery.js routes e e
Found 11 matching routes:
EBE (6)
EABE (6)
EADE (13)
EACDE (11)
EACFDE (10)
EADEBE (19)
EBEADE (19)
EACDEBE (17)
EBEACDE (17)
EACFDEBE (16)
EBEACFDE (16)

yann$ node delivery.js routes e e 20 true true
Found 29 matching routes:
EBE (6)
EABE (6)
EADE (13)
EACDE (11)
EBEBE (12)
EABEBE (12)
EACFDE (10)
EADEBE (19)
EBEABE (12)
EBEADE (19)
EABEABE (12)
EABEADE (19)
EACDEBE (17)
EADEABE (19)
EBEACDE (17)
EBEBEBE (18)
EABEACDE (17)
EABEBEBE (18)
EACDEABE (17)
EACFDEBE (16)
EBEABEBE (18)
EBEACFDE (16)
EBEBEABE (18)
EABEABEBE (18)
EABEACFDE (16)
EABEBEABE (18)
EACFDEABE (16)
EBEABEABE (18)
EABEABEABE (18)

yann$ node delivery.js shortest e d
EACFD (9)

yann$ node delivery.js shortest e e
EABE (6)
```
