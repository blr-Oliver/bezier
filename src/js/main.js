const SVG_NS = "http://www.w3.org/2000/svg";

window.addEventListener('load', function(){
  var
    applyHandler = () => render(document.querySelector('svg'), document.querySelector('#path').value),
    randomHandler = () => (document.querySelector('#path').value = randomCurve().toPath());

  document.querySelector('#random').addEventListener('click', randomHandler);
  document.querySelector('#apply').addEventListener('click', applyHandler);
  
  randomHandler();
  applyHandler();

  //M -48.58 -28.96 C -231.13 -73.26 -76.17 -62.44 -51.66 -40.32
});

function randomCurve(){
  var rs = () => rnd(0, 100), rl = () => rnd(-50, 150);
  return new Bezier(...[rs(), rs(), rl(), rl(), rl(), rl(), rs(), rs()].map(x => +x.toFixed(2)));
}

function rnd(from, to){
  return Math.random() * (to - from) + from;
}

function render(svg, path){
  var
    bezier = Bezier.fromPath(path),
    bbox = bezier.getBBox(),
    d = Math.hypot(bbox.width, bbox.height);

  removeAll(svg);
  appendAll(svg,
      createSVGElement('path', {d: path}, 'curve'),
      createSVGElement('rect', bbox, 'box'),
      appendAll(createSVGElement('g', 0, 'key-points'),
          ...createTangents(bezier, 0, 1, d/2),
          ...createTangents(bezier, 1, 0, d/2),
          ...createTangents(bezier, 1, 1, d/2),
          ...createTangents(bezier, -1, 1, d/2)
      )
  )
}

function removeAll(parent, node){
  while(node = parent.lastChild)
    node.remove();
}

function appendAll(parent){
  [].slice.call(arguments, 1).forEach(node => parent.appendChild(node));
  return parent;
}

function createTangents(bezier, tx, ty, d){
  var points = bezier.tangentPoints(tx, ty).filter(t => !!t).map(t => bezier.at(t));
  var k = d/2 / Math.hypot(tx, ty);
  return [
          ...points.map(p => createSVGElement('circle', {cx: p[0], cy: p[1], r: 1.2})),
          ...points.map(p => createSVGElement('line', {x1: p[0] - k*tx, x2: p[0] + k*tx, y1: p[1] - k*ty, y2: p[1] + k*ty}))
        ];
}

function createSVGElement(name, props, ...classes){
  var element = document.createElementNS(SVG_NS, name);
  props && Object.keys(props).forEach(key => element.setAttributeNS(null, key, props[key]));
  classes && classes.forEach(c => element.classList.add(c));
  return element;
}
