export const renderData = {
  1: { icon: "icon-Pagex", path: "" },
  2: { icon: "", path: "/form" },
  3: {
    path: "/", // customer-management
    icon: "icon-icon-test23"
  },
  4: {
    path: "/material-data/designer/home",
    icon: "icon-icon-test23"
  },
  5: {
    path: "/",
    icon: ""
  },
  10: {
    path: "/url-state",
    icon: "icon-guidang"
  },
};

const transformSidebarData = data => {
  if (!data.length) return;
  return data
    .map(e => {
      return {
        ...e,
        icon: renderData[e.id].icon,
        path: renderData[e.id].path,
        children: data
          .filter(d => d.pid === e.id)
          .map(e => {
            return {
              ...e,
              icon: renderData[e.id].icon,
              path: renderData[e.id].path
            };
          })
      };
    })
    .filter(e => e.pid === 0);
};

export const Sidebar = {
  namespace: "sidebar",
  state: {
    title: "",
    data: [],
    selectedKeys: [],
  },
  reducers: {
    updateSidebar(state, action) {
      const dataTransformed = transformSidebarData(action.data);
      return {
        ...state,
        data: dataTransformed
      };
    },
    updateTitle(state, action) {
      return {
        ...state,
        title: action.data,
      };
    },
    activeMenuItemByPath(state, action) {
      const {data} = state;
      const pathname = action.data;

      if (!data || !data.length) {
        return state;
      }

      try {
        // 有可能出现找不到的情况
        const sidebarData = state.data.reduce((p, n) => {
          return [
            ...p,
            n,
            ...n.children,
          ]
        }, []);
        const item = sidebarData.find(e => e.path === pathname);
        return {
          ...state,
          selectedKeys: ['' + item.id],
        }
      } catch(e) {
        console.log(`sidebar: active menu item failed. "${pathname}" not found`)
        return state;
      }
    }
  },
  subscriptions: {
    routeWatch({dispatch, history}) {
      return history.listen(({pathname}) => {
        dispatch({type: 'activeMenuItemByPath', data: pathname})
      });
    },
  }
};
