// Generated by BUCKLESCRIPT VERSION 1.7.4, PLEASE EDIT WITH CARE
'use strict';

var List       = require("bs-platform/lib/js/list.js");
var Curry      = require("bs-platform/lib/js/curry.js");
var Utils      = require("../utils.js");
var Random     = require("bs-platform/lib/js/random.js");
var Caml_obj   = require("bs-platform/lib/js/caml_obj.js");
var Generator  = require("../Types/generator.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");

function init(size) {
  var start = Random.$$int(size);
  return /* record */[
          /* visited */Caml_array.caml_make_vect(size, 0),
          /* edges */Generator.PairSet[/* empty */0],
          /* frontier : :: */[
            /* tuple */[
              start,
              start
            ],
            /* [] */0
          ],
          /* next : [] */0,
          /* step */0
        ];
}

function edges(state) {
  return state[/* edges */1];
}

function visited(state) {
  return state[/* visited */0];
}

function max_age(state) {
  return state[/* step */4];
}

function sortpair(a, b) {
  var match = Caml_obj.caml_greaterthan(a, b);
  if (match !== 0) {
    return /* tuple */[
            b,
            a
          ];
  } else {
    return /* tuple */[
            a,
            b
          ];
  }
}

function add_edges(adjacents, state, param) {
  var src = param[1];
  Caml_array.caml_array_set(state[/* visited */0], src, state[/* step */4] + 1 | 0);
  var next = List.fold_left(function (next, dest) {
        if (Caml_array.caml_array_get(state[/* visited */0], dest) > 0) {
          return next;
        } else {
          Caml_array.caml_array_set(state[/* visited */0], dest, state[/* step */4] + 1 | 0);
          return /* :: */[
                  /* tuple */[
                    src,
                    dest
                  ],
                  next
                ];
        }
      }, state[/* next */3], adjacents);
  return /* tuple */[
          next,
          Curry._2(Generator.PairSet[/* add */3], sortpair(param[0], src), state[/* edges */1]),
          state[/* step */4] + 1 | 0
        ];
}

function step(get_adjacent, state) {
  var match = state[/* frontier */2];
  if (match) {
    var rest = match[1];
    var match$1 = match[0];
    var src = match$1[1];
    var pre = match$1[0];
    if (rest) {
      var match$2 = add_edges(Curry._1(get_adjacent, src), state, /* tuple */[
            pre,
            src
          ]);
      return /* record */[
              /* visited */state[/* visited */0],
              /* edges */match$2[1],
              /* frontier */rest,
              /* next */match$2[0],
              /* step */match$2[2]
            ];
    } else {
      var match$3 = add_edges(Curry._1(get_adjacent, src), state, /* tuple */[
            pre,
            src
          ]);
      return /* record */[
              /* visited */state[/* visited */0],
              /* edges */match$3[1],
              /* frontier */Utils.shuffle(match$3[0]),
              /* next : [] */0,
              /* step */match$3[2]
            ];
    }
  } else {
    return state;
  }
}

function finished(state) {
  return +(state[/* frontier */2] === /* [] */0);
}

function loop_to_end(get_adjacent, _state) {
  while(true) {
    var state = _state;
    if (state[/* frontier */2] !== /* [] */0) {
      _state = step(get_adjacent, state);
      continue ;
      
    } else {
      return state;
    }
  };
}

function run(size, get_adjacent) {
  return loop_to_end(get_adjacent, init(size));
}

exports.init        = init;
exports.edges       = edges;
exports.visited     = visited;
exports.max_age     = max_age;
exports.sortpair    = sortpair;
exports.add_edges   = add_edges;
exports.step        = step;
exports.finished    = finished;
exports.loop_to_end = loop_to_end;
exports.run         = run;
/* Generator Not a pure module */