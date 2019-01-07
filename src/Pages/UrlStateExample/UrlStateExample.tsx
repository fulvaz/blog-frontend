import React, { Component } from "react";
import { PageLayout } from "../../Components/PageLayout/PageLayout";
import { PageTitle } from "../../Components/PageLayout/PageTitle";
import { PageContent } from "../../Components/PageLayout/PageContent";
import { Link } from "dva/router";
import { Table } from "antd";
import axios from "../../Utils/Request";

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


    // 比普通业务多出的代码start
    const {
      location: { search: currSearch }
    } = this.props as any;
    const currUrlParams = new URLSearchParams(currSearch);
    if (currUrlParams.get("table")) {
      const { pagination, filters, sorter } = JSON.parse(
        currUrlParams.get("table")
      );
      this.setState({
        pagination,
        filters,
        sorter
      });
    }
    // 比普通业务多出的代码end

    console.log("componentDidMount: emit when query string change");
    this.fetch();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 比普通业务多出的代码start
    const {
      location: { search: prevSearch }
    } = prevProps;
    const {
      location: { search: currSearch }
    } = this.props as any;
    const prevUrlParams = new URLSearchParams(prevSearch);
    const currUrlParams = new URLSearchParams(currSearch);

    if (prevUrlParams.get("table") !== currUrlParams.get("table")) {
      const { pagination, filters, sorter } = JSON.parse(
        currUrlParams.get("table")
      );
      this.setState({
        pagination,
        filters,
        sorter
      });
      this.fetch();
    }
    // 比普通业务多出的代码end
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination,
      filters,
      sorter
    });

    // 比普通业务多出的代码start
    const urlParams = new URLSearchParams();
    // 额外需要加的代码, 用decorator装饰起来
    urlParams.set(
      "table",
      JSON.stringify({
        pagination,
        filters,
        sorter
      })
    );
    (this.props as any).history.push(`?${urlParams}`);
    // 比普通业务多出的代码end
  };

  fetch = (_ = {}) => {
    const { pagination, sorter } = this.state;
    const params = {
      results: pagination.pageSize,
      page: pagination.current,
      sortField: (sorter as any).field,
      sortOrder: (sorter as any).order
    };

    console.log("params:", params);
    this.setState({ loading: true });
    axios({
      url: "https://randomuser.me/api",
      method: "get",
      params: {
        results: 10,
        ...params
      }
    }).then(res => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: (res.data as any).results,
        pagination
      });
    });
  };

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
            onChange={this.handleTableChange}
          />
        </PageContent>
      </PageLayout>
    );
  }
}
