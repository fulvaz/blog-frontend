import React, { Component } from "react";
import { PageLayout } from "../../Components/PageLayout/PageLayout";
import { PageTitle } from "../../Components/PageLayout/PageTitle";
import { PageContent } from "../../Components/PageLayout/PageContent";

export class TablePage extends Component {
  render() {
    return (
      <PageLayout ifBackShow={true}>
        <PageTitle>这是一个标题</PageTitle>
        <PageContent>
          <div style={{ height: "200vh" }}>这是内容</div>
        </PageContent>
      </PageLayout>
    );
  }
}
