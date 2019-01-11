export const Global = {
  namespace: 'global',
  state: {
    count: 0
  },
  reducers: {
    add(state) {
      return {
        ...state,
        current: state.current + 1
      };
    }
  },
  effects: {
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'add' });
    }
  },
  subscriptions: {
    setup(arg) {
      const { dispatch, history } = arg;
      // 监听路由的变化，请求页面数据
      return history.listen(a => {
        // 根据路径侧边栏高亮

      });
    }
  }
};

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
