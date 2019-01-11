export const IFRAME_ROUTE_PREFIX = "/remote";

export const IFrame = {
  namespace: "iframe",
  state: {
    src: "",
    ifHide: true,
    msgs: {},
  },
  reducers: {
    jumpToSrc(state, action) {
      const src = action.payload;
      return {
        ...state,
        src
      };
    },
    hide(state, action) {
      return {
        ...state,
        ifHide: true
      };
    },
    show(state, action) {
      return {
        ...state,
        ifHide: false
      };
    }
  },
  effects: {},
  subscriptions: {
    routeWatch({ dispatch, history }) {
      return history.listen(({ search, pathname }) => {
        if (pathname === IFRAME_ROUTE_PREFIX) {
          console.log(pathname, IFRAME_ROUTE_PREFIX);
          const param = new URLSearchParams(search);
          const src = param.get("src");
          dispatch({ type: "jumpToSrc", payload: src });
          dispatch({ type: "show" });
        } else {
          dispatch({ type: "hide" });
          return;
        }
      });
    }
  }
};
