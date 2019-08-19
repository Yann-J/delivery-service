const _ = require("lodash");

function Graph(distances) {
    this._distances = distances;
    return this;
};

Graph.prototype.hopCost = function(a,b) {
    return (this._distances && this._distances[a] && this._distances[a][b]) || undefined;
};

Graph.prototype.routeCost = function(route) {
    let nodeSequence = _.isArray(route) ? route : _.split(route,'');
    if(!nodeSequence || nodeSequence.length < 2) {
        return undefined;
    }
    
    let totalDistance = 0;
    for(let i=0; i<nodeSequence.length-1; i++) {
        let distance = this.hopCost(nodeSequence[i], nodeSequence[i+1]);

        if (distance === undefined) {
            return undefined;
        }
        else {
            totalDistance += distance;
        }
    }

    return totalDistance;
};

Graph.prototype.allRoutes = function(from, to, maxHops=Infinity, canRepeat=false) {
    // brute iteration...
    let allRoutes = [[from]];
    let matchingRoutes = [];
    let hops = 0;

    while(hops++ < maxHops && allRoutes.length) {
        // Take each computed route and add all possible next hops at once
        allRoutes = _.filter(_.flatMap(allRoutes, route => {
            let currentNode = _.last(route);
            let nextNodes = _.keys(this._distances[currentNode]);
            if(!canRepeat) {
                // Ignore nodes already visited in this route... except the first one since we allow such loops temporarily just to build the results
                nextNodes = _.difference(nextNodes, _.drop(route,1));
            }
            // Return an array of the initial route + all the eligible next hops (if there are none, return empty array)
            return _.map(nextNodes, next => _.concat(route, next));
        }), route => route.length); // remove empty routes

        // Add all routes that end with our destination to the list of solutions
        matchingRoutes = _.concat(matchingRoutes, _.filter(allRoutes, route => _.last(route)==to));

        // Don't proceed further for routes that start and end at the same node if we don't allow repeats
        if(from == to && !canRepeat) {
            allRoutes = _.filter(allRoutes, route => _.first(route) != _.last(route));
        }
    }

    return matchingRoutes;
};

Graph.prototype.shortestRoute = function(from, to) {
    if(from == to) {
        // Dijkstra doesn't seem to work well for non-trivial closed loops, so just doing one hop and aggregating:
        let bestPath = undefined;
        let bestScore = Infinity;
        _.forOwn(this._distances[from], (dist, firstHop) => {
            // shortest path from the first hop
            let path = this.shortestRoute(firstHop,to);
            if(path) {
                let totalCost = dist + this.routeCost(path.join(''));
                if(totalCost < bestScore) {
                    bestPath = _.concat([from], path);
                    bestScore = totalCost;
                }
            }
        });
        return bestPath;
    }
    else {
        // dijkstra... certainly overkill for this problem's size! We could also just iterate on all possible paths but this is more fun...

        // Naive way to list all nodes in the graph...
        let nodes = _.keys(this._distances);
        // Init structure holding all the travelled distances and visited status
        let allDistances  = _.map(nodes, (node) => ({name: node, visited: false, distance: (node==from ? 0 : Infinity)}));
        // Keep our track...
        let previousNode  = _.mapValues(this._distances, () => undefined);

        // While we still have unvisited nodes...
        while(_.filter(allDistances,['visited',false]).length) {
            // Pick the unvisited node with the shortest distance travelled so far
            let currentNode = _.minBy(_.filter(allDistances,['visited',false]), 'distance');
            currentNode.visited = true;

            // Are we at destination after a non-empty path?
            if(currentNode.name == to) {
                // We have arrived! But not necessarily with a completed (non-infinity) path
                if(currentNode.distance == Infinity) {
                    return undefined;
                }
                else {
                    // We have found a matching path... let's reverse-lookup the path from previousNode chain
                    let path = [to];
                    while(from != _.first(path) ) {
                        path.unshift(previousNode[_.first(path)]);
                    }
                    return path;
                }
            }

            // Check all neighbors and compute their new shortest distance so far
            _.forOwn(this._distances[currentNode.name], (dist, neighborName) => {
                let newDistance = currentNode.distance + dist;
                // Lookup the neighbor's existing distance
                let neighborNode = _.find(allDistances, ['name',neighborName]);
                // Update the node distance if we have improved it or was zero
                if(newDistance < neighborNode.distance) {
                    neighborNode.distance = newDistance;
                    previousNode[neighborName] = currentNode.name;
                }
            });
        }

        return undefined;
    }
}

module.exports = Graph;


