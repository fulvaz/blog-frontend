import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'dva/router';
import { API } from '../../utils/api';
import { Spin } from 'antd';
import { loading } from '../../utils/loadingDecorator';

export class ArticleList extends React.Component {
    public props: {
        articles: Array<{
            id: number;
            title: string;
            date: Date;
            content: string;
        }>;
    };

    public state = {
        ifLoading: false,
        articles: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    };

    async componentDidMount() {
        await this.fetchList();
    }

    @loading()
    async fetchList() {
        this.setState({ ifLoading: true });
        const {current, pageSize} = this.state.pagination;
        const res = await API.fetchArticles({
            page: current,
            size: pageSize,
        });
        const {total} = res.pagination;
        this.setState({
            articles: res.data,
            ifLoading: false,
            total,
        });
    }

    async onListChange(pagination) {
        const { current, pageSize } = pagination;
        this.state.pagination = {
            ...this.state.pagination,
            current,
            pageSize,
        };
        this.fetchList();
    }

    public render() {
        const { ifLoading, articles } = this.state;
        const { current, pageSize, total } = this.state.pagination;
        
        const ifPaginationShow = total < current * pageSize;
        const pagination = ifPaginationShow ? (<div className="flex flex-jcc" onClick={() => {
            this.onListChange({pageSize, current: current + 1});
        }}><span className="cp">下一页</span></div>) : '';

        const articlesTpl = articles.length !== 0 ? articles.map(e => {
            const { title, content, id } = e;
            const abstract = content.slice(0, 300);
            return (
                <Link to={`/article/${id}`} key={id}>
                    <div key={id}>
                        <h2 className={classNames('color-black')}>
                            {title}
                        </h2>
                        <div className={classNames('color-black')}>
                            <ReactMarkdown source={abstract} />
                        </div>
                    </div>
                </Link>
            );
        }) : <span>暂无数据</span>;

    return (
            <div>
                <Spin spinning={ifLoading}>
                    {articlesTpl}
                    {pagination}
                </Spin>
            </div>
        );
    }
}
