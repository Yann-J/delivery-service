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

