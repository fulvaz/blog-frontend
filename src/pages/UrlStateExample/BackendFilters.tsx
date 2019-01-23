import React, { Component } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageTitle } from '../../components/PageLayout/PageTitle';
import { PageContent } from '../../components/PageLayout/PageContent';
import { Table } from 'antd';
import { API } from '../../utils/api';
import { urlState, changeUrl, fetchApi } from '../../utils/urlState/decorator';

@urlState(
    data => {
        const { pagination, filters, sorter } = data;
        const { current, pageSize } = pagination;
        const { name } = filters;
        const { order, columnKey } = sorter;
        return {
            current,
            pageSize,
            name: JSON.stringify(name), // 需要自行保证key和value都是字符串
            columnKey,
            order,
        };
    },
    params => {
        // 需要自行整理成state的数据结构
        // params返回的全部是字符串, 需要自己转换为对应数据格式
        const { current, pageSize, name, columnKey, order } = params;
        return {
            pagination: {
                current: parseInt(current, 10),
                pageSize: parseInt(pageSize, 10),
            },
            filters: {
                name: JSON.parse(name), // 也需要自行翻序列化
            },
            sorter: {
                columnKey,
                order,
            },
        };
    },
    {
    //   apiConfig: [
    //     // api是这个类里面负责请求api的方法名, deps是这些api依赖的筛选字段名, 字段名指你自行指定的, 在url上的key
    //     {api: 'fetch', deps: ['current', 'pageSize', 'name', 'columnKey', 'order']}
    //   ],
    },
)
export class BackendFilters extends Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            total: 0,
            pageSize: 10,
        },
        filters: {
            name: [],
        },
        sorter: {
            columnKey: '',
            order: '',
        },
        loading: false,
    };

    get column() {
        return [
            {
                title: 'id',
                dataIndex: 'id',
                sorter: (a, b) => a.id - b.id,
                sortDirections: ['descend', 'ascend'],
                sortOrder:
                    this.state.sorter.columnKey === 'id' &&
                    (this.state.sorter.order as any),
            },
            {
                title: 'Name',
                dataIndex: 'name',
                width: '20%',
                filters: [
                    { text: '含有0', value: '0' },
                    { text: '含有1', value: '1' },
                ],
                filteredValue: this.state.filters.name,
            },
            {
                title: 'Title',
                dataIndex: 'title',
                width: '20%',
                sorter: (a, b) => a.title.length - b.title.length,
                sortDirections: ['descend', 'ascend'],
                sortOrder:
                    this.state.sorter.columnKey === 'title' &&
                    (this.state.sorter.order as any),
            },
        ];
    }

    componentDidMount() {
        console.log('componentDidMount: emit when query string change');
        this.fetch();
    }

    @changeUrl()
    handleTableChange(pagination, filters, sorter) {
        this.state = {
            ...this.state,
            pagination,
            filters,
            sorter,
        };

        // this.setState({
        //   ...this.state
        // });
        // this.fetch();
        // 这里不可以在放fetch, 否则会发两次请求
    }

    @fetchApi({deps: ['current', 'pageSize', 'name', 'columnKey', 'order']})
    async fetch() {
        const { pagination, sorter, filters } = this.state;

        const { current: page, pageSize: size } = pagination;

        const res = await API.fetchFakeData({
            page,
            size,
            name: filters.name,
            sort: sorter.order,
            filters,
        });

        this.setState({
            loading: false,
            data: (res as any).data,
            pagination: {
                ...this.state.pagination,
                total: +(res as any).totalSize,
            },
        });
    }

    render() {
        return (
            <PageLayout ifBackShow={true}>
                <PageTitle>后端筛选</PageTitle>
                <PageContent>
                    <Table
                        columns={this.column}
                        rowKey={record => record.id}
                        dataSource={this.state.data}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                        onChange={this.handleTableChange.bind(this)}
                    />
                </PageContent>
            </PageLayout>
        );
    }
}
