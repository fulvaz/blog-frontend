import React, { Component } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageTitle } from '../../components/PageLayout/PageTitle';
import { PageContent } from '../../components/PageLayout/PageContent';
import { Table } from 'antd';
import { API } from '../../utils/api';
import { urlState, changeUrl, fetchApi } from '../../utils/urlState/decorator';
import { connect } from 'dva';
import { PageComponent } from '../../utils/type';

@connect(state => {
    const { current, pageSize, name, columnKey, order } = state.dva.filters;

    const { dataSource, total } = state.dva;

    return {
        filters: {
            current,
            pageSize,
            columnKey,
            order,
            name,
        },
        dataSource,
        total,
    };
})
@urlState(
    // 这里的data是this.props.filters
    data => {
        const { current, pageSize, columnKey, order, name } = data;
        return {
            current,
            pageSize,
            columnKey,
            order,
            name: JSON.stringify(name),
        };
    },
    params => {
        // 需要自行整理成state的数据结构
        // params返回的全部是字符串, 需要自己转换为对应数据格式
        const { current, pageSize, columnKey, order, name } = params;
        return {
            current: parseInt(current, 10),
            pageSize: parseInt(pageSize, 10),
            columnKey,
            order,
            name: JSON.parse(name),
        };
    },
    {
        ifDva: true,
        dvaFilterEvent: 'dva/updateFilters',
    }
)
export class Dva extends Component<
    PageComponent<{
        filters: {
            current: number;
            pageSize: number;
            columnKey: string;
            order: string;
            name: string[];
        };
        total: number;
        dataSource: any[];
    }>
> {
    state = {
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
                    this.props.filters.columnKey === 'id' &&
                    (this.props.filters.order as any),
            },
            {
                title: 'Name',
                dataIndex: 'name',
                width: '20%',
                filters: [
                    { text: '含有0', value: '0' },
                    { text: '含有1', value: '1' },
                ],
                filteredValue: this.props.filters.name,
            },
            {
                title: 'Title',
                dataIndex: 'title',
                width: '20%',
                sorter: (a, b) => a.title.length - b.title.length,
                sortDirections: ['descend', 'ascend'],
                sortOrder:
                    this.props.filters.columnKey === 'title' &&
                    (this.props.filters.order as any),
            },
        ];
    }

    componentDidMount() {
        console.log('componentDidMount: emit when query string change');
        this.fetch();
    }

    @changeUrl()
    handleTableChange(pagination, filters, sorter) {
        const { current, pageSize } = pagination;
        const { name } = filters;
        const { columnKey, order } = sorter;

        this.props.dispatch({
            type: 'dva/updateFilters',
            payload: {
                current,
                pageSize,
                name,
                columnKey,
                order,
            },
        });

        // 不调用fetch
    }

    @fetchApi({deps: ['current', 'pageSize', 'name', 'columnKey', 'order']})
    async fetch() {
        this.props.dispatch({ type: 'dva/fetchList' });
    }

    render() {
        const { dataSource, total } = this.props;
        const {
            current,
            pageSize,
            name,
            columnKey,
            order,
        } = this.props.filters;

        const pagination = {
            current,
            total,
            pageSize,
        };

        return (
            <PageLayout ifBackShow={true}>
                <PageTitle>后端筛选</PageTitle>
                <PageContent>
                    <Table
                        columns={this.column}
                        rowKey={record => record.id}
                        dataSource={dataSource}
                        pagination={pagination}
                        loading={this.state.loading}
                        onChange={this.handleTableChange.bind(this)}
                    />
                </PageContent>
            </PageLayout>
        );
    }
}
