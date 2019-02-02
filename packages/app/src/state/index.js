import stream from "mithril/stream";
import { P } from "patchinko/explicit";
import { attrsAsObject } from "./attrsAsObject";
import { examples } from "./examples";
import { indent } from "./indent";
import { output } from "./output";
import { source } from "./source";

const update = stream();

export const states = stream.scan(P, {
  ...attrsAsObject.initialState,
  ...examples.initialState,
  ...indent.initialState,
  ...output.initialState,
  ...source.initialState,
}, update);

export const actions = {
  ...attrsAsObject.actions(update),
  ...examples.actions(update),
  ...indent.actions(update),
  ...output.actions(update),
  ...source.actions(update),
};

// states.map(state => 
//   console.log(JSON.stringify(state, null, 2))
// );
