import React, { Component } from "react";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { PageTitle } from "../../components/PageLayout/PageTitle";
import { PageContent } from "../../components/PageLayout/PageContent";
import { Table } from "antd";
import axios from "../../utils/request";
import { changeUrl, putStateInUrl } from "../../utils/urlState";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  }
];

@putStateInUrl({ table: { api: "fetch" } })
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
    console.log("componentDidMount: emit when query string change");
    this.fetch();
  }

  @changeUrl({
    namespace: "table",
    filters: ["pagination", "filters", "sorter"]
  })
  handleTableChange(pagination, filters, sorter) {
    this.state = {
      ...this.state,
      pagination,
      filters,
      sorter
    };
    // this.fetch();
    // 这里不可以在放fetch, 否则会发两次请求

  }

  fetch(_ = {}) {
    const { pagination, sorter } = this.state;
    const params = {
      results: pagination.pageSize,
      page: pagination.current,
      sortField: (sorter as any).field,
      sortOrder: (sorter as any).order
    };

    // console.log("params:", params);
    // this.setState({ loading: true });
    // axios({
    //   url: "https://randomuser.me/api",
    //   method: "get",
    //   params: {
    //     results: 10,
    //     ...params
    //   }
    // }).then(res => {
    //   const pagination = { ...this.state.pagination };
    //   // Read total count from server
    //   // pagination.total = data.totalCount;
    //   pagination.total = 200;
    //   this.setState({
    //     loading: false,
    //     data: (res.data as any).results,
    //     pagination
    //   });
    // });
  }

  render() {
    return (
      <PageLayout ifBackShow={true}>
        <PageTitle>这是一个标题</PageTitle>
        <PageContent>
          <Table
            columns={columns}
            rowKey={record => record.login.uuid}
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
