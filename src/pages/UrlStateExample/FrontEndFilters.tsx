import React, { Component } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageTitle } from '../../components/PageLayout/PageTitle';
import { PageContent } from '../../components/PageLayout/PageContent';
import { Table } from 'antd';
import { API } from '../../utils/api';

// @putStateInUrl('table', { fetch: ['pagination', 'filters', 'sorter'] })
export class FrontendFilters extends Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10
    },
    filters: {
      name: []
    },
    sorter: {
      columnKey: '',
      order: ''
    },
    loading: false
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
          (this.state.sorter.order as any)
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: '20%',
        filters: [{ text: '含有0', value: '0' }, { text: '含有1', value: '1' }],
        filteredValue: this.state.filters.name,
        onFilter: (value, record) => record.name.includes(value)
      },
      {
        title: 'Title',
        dataIndex: 'title',
        width: '20%',
        sorter: (a, b) => a.title.length - b.title.length,
        sortDirections: ['descend', 'ascend'],
        sortOrder:
          this.state.sorter.columnKey === 'title' &&
          (this.state.sorter.order as any)
      }
    ];
  }

  componentDidMount() {
    console.log('componentDidMount: emit when query string change');
    const { pagination, sorter } = this.state;
    this.fetch({ pagination, sorter });
  }

  // @changeUrl({
  //   namespace: 'table',
  //   filters: ['pagination', 'filters', 'sorter']
  // })
  handleTableChange(pagination, filters, sorter) {
    this.state = {
      ...this.state,
      pagination,
      filters,
      sorter
    };
    
    this.setState({
      ...this.state,
    });
    // this.fetch();
    // 这里不可以在放fetch, 否则会发两次请求
  }

  async fetch(params: any) {
    const { pagination, sorter } = params;

    const { current: page, pageSize: size } = pagination;

    const res = await API.fetchFakeData({ page, size });

    this.setState({
      loading: false,
      data: (res as any).data,
      pagination: {
        ...this.state.pagination,
        total: +(res as any).totalSize
      }
    });
  }

  render() {
    return (
      <PageLayout ifBackShow={true}>
        <PageTitle>带前端筛选</PageTitle>
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
