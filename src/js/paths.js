function SVGPath(d){
  this.d = d;
}

SVGPath.prototype = {
  buildSegments: function(){
    
  }
}

function SVGPathSegment(){}
SVGPathSegment.byLetter = function(letter, ...params){}
function SVGPathSegmentClose(){}
function SVGPathSegmentMove(){}
function SVGPathSegmentLine(){}
function SVGPathSegmentHorizontal(){}
function SVGPathSegmentVertical(){}
function SVGPathSegmentQuadratic(){}
function SVGPathSegmentQuadraticSmooth(){}
function SVGPathSegmentCubic(){}
function SVGPathSegmentCubicSmooth(){}
function SVGPathSegmentArc(){}

eval('function SVGPathSegmentMoveRel(){}');