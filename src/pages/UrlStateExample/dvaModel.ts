import { API } from '../../utils/api';

export const dvaModel = {
    namespace: 'dva',
    state: {
        dataSource: [],
        total: 0,
        filters: {
            current: 1,
            pageSize: 10,
            name: [],
            columnKey: '',
            order: '',
        },
    },
    reducers: {
        updateList(state, { payload }) {
            const { totalSize: total, data: dataSource } = payload;
            return {
                ...state,
                dataSource,
                total,
            };
        },
        updateFilters(state, { payload }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...payload,
                },
            };
        },
    },
    effects: {
        *fetchList({ payload = {} }, { put, call, select }) {
            const { current, pageSize, name, columnKey, order } = yield select(
                state => state.dva.filters
            );

            const { params, option } = payload as any;

            const res = yield call(
                API.fetchFakeData,
                {
                    size: pageSize,
                    page: current,
                    columnKey,
                    order,
                    name,
                    ...params,
                },
                option
            );
            yield put({
                type: 'updateList',
                payload: res,
            });
        },
    },
};
