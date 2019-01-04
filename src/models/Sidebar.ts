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
  6: {
    path: "/conversion-data/conversions", // customer-management
    icon: "icon-Pagex"
  },
  7: {
    path: "/conversion-data/conversions",
    icon: ""
  },
  8: {
    path: "/user-data/users",
    icon: "icon-icon-test22"
  },
  9: {
    path: "/platform-data/customer",
    icon: ""
  },
  10: {
    path: "/platform-data/company",
    icon: "icon-guidang"
  },
  11: {
    path: "/platform-data/web-crawler",
    icon: ""
  },
  12: {
    path: "/material-data/material",
    icon: ""
  },
  13: {
    path: "/mapi-customer/agency",
    icon: "icon-Pagex"
  },
  14: {
    path: "/mapi-customer/agency",
    icon: "icon-Pagex"
  },
  15: {
    path: "/mapi-customer/guest",
    icon: "icon-Pagex"
  },
  19: {
    path: "/settlements-data/effect",
    icon: "icon-icon-test5"
  },
  20: {
    path: "/settlements-data/effect",
    icon: "icon-Pagex"
  },
  21: {
    path: "/settlements-data/settlement",
    icon: "icon-Pagex"
  },
  26: {
    path: "/pkg-data/pkgs",
    icon: "icon-Pagex"
  },
  32: {
    path: "/finance-data/finance",
    icon: "icon-Pagex"
  },
  24: {
    path: "/audience",
    icon: "icon-Pagex"
  },
  25: {
    path: "/audience",
    icon: "icon-Pagex"
  },
  27: {
    path: "/customer-group",
    icon: "icon-Pagex"
  },
  32: {
    path: "/customer-group",
    icon: "icon-Pagex"
  },
  33: {
    path: "/customer-group",
    icon: "icon-Pagex"
  }
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
