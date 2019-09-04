import m from "mithril";
import stream from "mithril/stream";
import { P } from "patchinko/explicit";
import { attrs } from "./attrs";
import { examples } from "./examples";
import { indent } from "./indent";
import { output } from "./output";
import { quotes } from "./quotes";
import { source } from "./source";

const update = stream();

export const states = stream.scan(P, {
  ...attrs.initialState,
  ...examples.initialState,
  ...indent.initialState,
  ...output.initialState,
  ...quotes.initialState,
  ...source.initialState,
}, update);

export const actions = {
  ...attrs.actions(update),
  ...examples.actions(update),
  ...indent.actions(update),
  ...output.actions(update),
  ...quotes.actions(update),
  ...source.actions(update),
};

states.map(state => 
  // console.log(JSON.stringify(state, null, 2))
  m.redraw()
);
