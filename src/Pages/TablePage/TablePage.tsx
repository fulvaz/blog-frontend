import React, { Component } from "react";
import { PageLayout } from "../../Components/PageLayout/PageLayout";
import { PageTitle } from "../../Components/PageLayout/PageTitle";
import { PageContent } from "../../Components/PageLayout/PageContent";
import { Link } from "dva/router";
import { connect } from "dva";

export class TablePage extends Component {
  render() {
    return (
      <PageLayout ifBackShow={true}>
        <PageTitle>这是一个标题</PageTitle>
        <PageContent>
          <div style={{ height: "200vh" }}>
            <Link to="form">About</Link>
            这是表格
          </div>
        </PageContent>
      </PageLayout>
    );
  }
}
