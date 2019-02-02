
export const output = {
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
