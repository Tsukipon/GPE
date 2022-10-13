import { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  connected: true,
};

const reducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;