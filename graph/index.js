const _ = require("lodash");

function Graph(distances) {
    this._distances = distances;
    return this;
};

Graph.prototype.hopCost = function(a,b) {
    return (this._distances && this._distances[a] && this._distances[a][b]) || undefined;
};

Graph.prototype.routeCost = function(route) {
    // Accept either an array or string...
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

Graph.prototype.allRoutes = function(from, to, maxHops=Infinity, maxCost=Infinity, canRepeat=false) {
    let matchingRoutes = [];
    let hops = 0;

    // brute iteration: start from the simplest route
    let allRoutes = [[from]];
    while(hops++ < maxHops && allRoutes.length) {
        // Take each previously computed route and add all possible next hops at once
        allRoutes = _.flatMap(allRoutes, route => {
            let currentNode = _.last(route);
            let nextNodes = _.keys(this._distances[currentNode]);
            if(!canRepeat) {
                // Ignore nodes if we have already travelled this specific hop...
                nextNodes = _.filter(nextNodes, node => {
                    for(let i=0; i<route.length-1; i++) {
                        if(route[i]==currentNode && route[i+1]==node) {return false;}
                    }
                    return true;
                });
            }
            // Return an array of the initial route + all the eligible next hops (if there are none, return empty array)
            return _.map(nextNodes, next => _.concat(route, next));
        });

        // drop empty and expensive routes
        allRoutes = _.filter(allRoutes, route => route.length && (maxCost == Infinity || this.routeCost(route) < maxCost));

        // Add all the routes that have reached destination to the list of solutions
        matchingRoutes = _.concat(matchingRoutes, _.filter(allRoutes, route => _.last(route)==to));
    }

    return matchingRoutes;
};

Graph.prototype.shortestRoute = function(from, to) {
    if(from == to) {
        // Dijkstra doesn't seem to work for non-trivial closed loops, so just doing one initial hop and computing the best paths from there
        // Alternatively we could also add a shadow node as suggested in https://stackoverflow.com/questions/25408477/dijkstras-or-other-shortest-path-algorithm-where-end-node-can-be-start-node
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

        // List all nodes in the graph...
        let nodes = _.uniq(
            _.concat(
                _.keys(this._distances),  // All starting nodes
                 _.flatMap(_.mapValues(this._distances, _.keys))  // All destination nodes
            )
        );
        // Init structure holding all the travelled distances and visited status
        let allDistances  = _.map(nodes, (node) => ({name: node, visited: false, distance: (node==from ? 0 : Infinity)}));
        // Keep our track...
        let previousNode  = _.mapValues(this._distances, () => undefined);

        // While we still have unvisited nodes...
        while(_.filter(allDistances,['visited',false]).length) {
            // Pick the unvisited node with the shortest distance travelled so far
            let currentNode = _.minBy(_.filter(allDistances,['visited',false]), 'distance');
            currentNode.visited = true;

            // Are we at destination?
            if(currentNode.name == to) {
                // We have arrived! But not necessarily with a completed (non-infinity) path
                if(currentNode.distance == Infinity) {
                    return undefined;
                }
                else {
                    // We have found a matching path... let's reverse-build the path from previousNode chain
                    let path = [to];
                    // keep adding the predecessor of the first element
                    while(from != _.first(path) ) {
                        path.unshift(previousNode[_.first(path)]);
                    }
                    return path;
                }
            }

            // Check all neighbors and compute their new shortest travelled distance so far
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


