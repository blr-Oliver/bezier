function Polynom(...values){
  this.values = values || [];
}
Polynom.prototype = {
    get rank(){
      return this.values.length - 1;
    },
    clone: function(){
      return new Polynom(...this.values.slice());
    },
    at: function(t){
      return this.values.reduceRight(function(r, e){
        return r * t + e;
      }, 0);
    },
    multiplyScalar: function(s){
      for(var i = this.values.length - 1; i >= 0; --i)
        this.values[i] *= s;
      return this;
    },
    multiplyPoly: function(p){
      return this.multiplyValues(...p.values);
    },
    multiplyValues: function(...values){
      var newValues = Array(this.rank + values.length).fill(0);
      for(var i = 0; i < values.length; ++i)
        for(var j = 0; j <= this.rank; ++j)
          newValues[i + j] += values[i] * this.values[j];
      this.values = newValues;
      return this;
    },
    sumPoly: function(p){
      return this.sumValues(...p.values);
    },
    sumValues: function(...values){
      const l = Math.max(this.values.length, values.length);
      for(var i = 0; i < l; ++i)
        this.values[i] = (this.values[i] || 0) + (values[i] || 0);
      return this;
    },
    subtractPoly: function(p){
      return this.subtractValues(...p.values);
    },
    subtractValues: function(...values){
      const l = Math.max(this.values.length, values.length);
      for(var i = 0; i < l; ++i)
        this.values[i] = (this.values[i] || 0) - (values[i] || 0);
      return this;
    }
}