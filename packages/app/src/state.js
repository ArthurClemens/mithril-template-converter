import stream from "mithril/stream";
import { P } from "patchinko/explicit";

const source = {
  initialState: {
    source: ""
  },
  actions: update => {
    return {
      setSource: value => {
        update({
          source: value
        });
      },
    };
  }
};

const output = {
  initialState: {
    output: ""
  },
  actions: update => {
    return {
      setOutput: value => {
        update({
          output: value
        });
      },
    };
  }
};

const renderAttrsAsObject = {
  initialState: {
    attrsAsObject: 1
  },
  actions: update => {
    return {
      setRenderAttrsAsObject: value => {
        update({
          renderAttrsAsObject: value
        });
      },
    };
  }
};

const update = stream();

export const states = stream.scan(P, {
  ...source.initialState,
  ...output.initialState.output,
  ...renderAttrsAsObject.initialState.output,
}, update);

export const actions = {
  ...source.actions(update),
  ...output.actions(update),
  ...renderAttrsAsObject.actions(update),
};

// states.map(state => 
//   console.log(JSON.stringify(state, null, 2))
// );