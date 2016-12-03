function Bezier(...values){
  this.values = values.slice(0, 8);
}

Bezier.prototype = {
  at: function(t){
    var roller = (e, i, a) => (i < a.length - 2) && (e + (a[i + 2] - e)*t), data = this.values;
    for(; data.length > 2; data.length -= 2)
      data = data.map(roller);
    return data;
  },
  getPolynoms: function(rank){
    var polynoms = [
      [new Polynom(this.values[0]), new Polynom(this.values[1])],
      [new Polynom(this.values[2]), new Polynom(this.values[3])],
      [new Polynom(this.values[4]), new Polynom(this.values[5])],
      [new Polynom(this.values[6]), new Polynom(this.values[7])]
    ];
    for(let i = 0; i < rank; ++i) {
      polynoms = polynoms.map(function(e, i, a){
        if(i < a.length - 1)
          return [rollUp(e[0], a[i + 1][0]), rollUp(e[1], a[i + 1][1])];
      }).slice(0, -1);
    } 
    return polynoms;
    function rollUp(p1, p2){
      return p1.clone().multiplyValues(1, -1).sumPoly(p2.clone().multiplyValues(0, 1));
    }
  },
  tangentPoints: function(tx, ty){
    var mn = this.getPolynoms(2);
    var tangent = [mn[1][0].subtractPoly(mn[0][0]), mn[1][1].subtractPoly(mn[0][1])];
    var eq = tangent[0].multiplyScalar(ty).subtractPoly(tangent[1].multiplyScalar(tx));
    return solveQuadratic(...eq.values).filter(t => t >= 0 && t <= 1);
  },
  getBBox: function(){
    var horizontal = this.tangentPoints(0, 1), vertical = this.tangentPoints(1, 0);
    var t = [0, 1];
    if(horizontal.length && !isNaN(horizontal[0])) t = t.concat(horizontal);
    if(vertical.length && !isNaN(vertical[0])) t = t.concat(vertical);
    var points = t.map(t => this.at(t));
    var x = points.map(p => p[0]), y = points.map(p => p[1]);
    var box = {
        x: Math.min(...x),
        y: Math.min(...y)
    };
    box.width = Math.max(...x) - box.x;
    box.height = Math.max(...y) - box.y;
    return box;
  },
  toPath: function(){
    return ["M", this.values[0], this.values[1], "C", ...this.values.slice(2)].join(" ");
  }
}
Bezier.fromPath = function(d){
  return new Bezier(...d.split(/(?:[MC\s]|(?=-))+/).filter(e => !!e).map(Number));
}
function solveQuadratic(c, b, a){
  if(!a) return b ? [-c/b] : (c ? [] : [NaN]);
  let d = b*b - 4*a*c;
  if(d < 0) return [];
  if(d === 0) return [-b/2/a];
  d = Math.sqrt(d);
  return [(-b-d)/2/a, (-b+d)/2/a];
}
