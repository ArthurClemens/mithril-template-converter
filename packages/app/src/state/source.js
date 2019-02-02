
export const source = {
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
