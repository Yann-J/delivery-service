let assert = require('assert');
let graph = require("../graph/index.js");
let myGraph = new graph({
    "A": {"B":1,"C":4,"D":10},
    "B": {"E":3},
    "C": {"D":4,"F":2},
    "D": {"E":1},
    "E": {"A":2,"B":3},
    "F": {"D":1},
});

describe('Graph', function() {
  describe('routeCost', function() {
    it('should return 4 for route ABE', function() {
      assert.equal(myGraph.routeCost('ABE'), 4);
    });

    it('should return 10 for route AD', function() {
      assert.equal(myGraph.routeCost('AD'), 10);
    });

    it('should return 8 for route EACF', function() {
      assert.equal(myGraph.routeCost('EACF'), 8);
    });

    it('should not find a route for ADF', function() {
      assert.equal(myGraph.routeCost('ADF'), undefined);
    });
  });

  describe('allRoutes', function() {
    it('should find 4 routes from E to D with less than 4 hops without repeating hops', function() {
      assert.equal(myGraph.allRoutes('E','D',4).length, 4);
    });

    it('should find 11 routes from E to E without repeating hops', function() {
      assert.equal(myGraph.allRoutes('E','E').length, 11);
    });

    it('should find 29 routes from E to E costing less than 20', function() {
      assert.equal(myGraph.allRoutes('E','E',Infinity,20,true).length, 29);
    });
  });

  describe('shortestRoute', function() {
    it('should find a shortest route of 9 from E to D', function() {
      assert.equal(myGraph.routeCost(myGraph.shortestRoute('E','D')), 9);
    });

    it('should find a shortest route of 6 from E to E', function() {
      assert.equal(myGraph.routeCost(myGraph.shortestRoute('E','E')), 6);
    });
  });
});

