import React, { Component } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageTitle } from '../../components/PageLayout/PageTitle';
import { PageContent } from '../../components/PageLayout/PageContent';
import { Table } from 'antd';
import axios from '../../utils/request';
import { changeUrl, putStateInUrl } from '../../utils/urls';
import { API } from '../../utils/api';

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%'
  },
  {
    title: 'Title',
    dataIndex: 'title',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' }
    ],
    width: '20%'
  },
];

@putStateInUrl('table', { fetch: ['pagination', 'filters', 'sorter'] })
export class UrlStateExample extends Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10
    },
    filters: {},
    sorter: {},
    loading: false
  };

  componentDidMount() {
    console.log('componentDidMount: emit when query string change');
  }

  @changeUrl({
    namespace: 'table',
    filters: ['pagination', 'filters', 'sorter']
  })
  handleTableChange(pagination, filters, sorter) {
    this.state = {
      ...this.state,
      pagination,
      filters,
      sorter
    };
    console.log(this.state)
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
        <PageTitle>这是一个标题</PageTitle>
        <PageContent>
          <Table
            columns={columns}
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
