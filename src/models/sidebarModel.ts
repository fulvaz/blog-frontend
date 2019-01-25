import { API } from '../utils/api';

export const renderData = {
    example: {
        path: '/example',
        icon: '', // 二级菜单设置icon无效
        name: '', // 现在name已经交给后端进行控制, 这个字段仅用来做备注
    },
    form: {
        path: '/form',
        icon: '',
        name: '',
    },
    table: {
        path: '/table',
        icon: '',
        name: '',
    },
    urlState: {
        path: '/url-state',
        icon: '',
        name: '',
    },
    urlStateCommonFilters: {
        path: '/url-state/',
        icon: '',
        name: '',
    },
    urlStateCustomCols: {
        path: '/url-state/custom-filters',
        icon: '',
        name: '',
    },
    urlStateFrontendFilters: {
        path: '/url-state/frontend-filtes',
        icon: '',
        name: '',
    },
    withDva: {
        path: '/url-state/with-dva',
        icon: '',
        name: '',
    },
    channelManagement: {
        path: '/frontend-filtes',
        icon: '',
        name: '',
    },
};

const transformSidebarData = data => {
    if (!data.length) return;
    try {
        return data
            .map(e => {
                return {
                    ...e,
                    icon: renderData[e.key].icon,
                    path: renderData[e.key].path,
                    children: data
                        .filter(d => d.pid === e.id)
                        .map(e => {
                            return {
                                ...e,
                                icon: renderData[e.key].icon,
                                path: renderData[e.key].path,
                            };
                        }),
                };
            })
            .filter(e => e.pid === 0);
    } catch (e) {
        console.error('Update sidebar error, please check renderData');
    }
};

export const Sidebar = {
    namespace: 'sidebar',
    state: {
        title: 'SSP IPortal',
        data: [],
        dataFlat: [],
        selectedKeys: [],
    },
    reducers: {
        updateSidebar(state, action) {
            const dataTransformed = transformSidebarData(action.payload);
            const dataFlat = action.payload.map(e => {
                return {
                    ...e,
                    icon: renderData[e.key].icon,
                    path: renderData[e.key].path,
                };
            });
            return {
                ...state,
                data: dataTransformed,
                dataFlat,
            };
        },
        activeMenuItemByPath(state, action) {
            const { data } = state;
            const pathname = action.payload;

            if (!data || !data.length) {
                return state;
            }

            try {
                // 有可能出现找不到的情况
                const sidebarData = state.data.reduce((p, n) => {
                    return [...p, n, ...n.children];
                }, []);
                const item = sidebarData.find(e => e.path === pathname);
                return {
                    ...state,
                    selectedKeys: ['' + item.id],
                };
            } catch (e) {
                console.log(
                    `sidebar: active menu item failed. "${pathname}" not found`
                );
                return state;
            }
        },
    },
    effects: {
        *fetchSidebar(action, { select, call, put }) {
            const menu = yield call(API.fetchMenu, {});
            yield put({ type: 'updateSidebar', payload: menu });
        },
    },
    subscriptions: {
        routeWatch({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                dispatch({ type: 'activeMenuItemByPath', payload: pathname });
            });
        },
    },
};
