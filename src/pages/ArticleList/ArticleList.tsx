import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { API } from '../../utils/api';
import { Spin } from 'antd';
import { loading } from '../../utils/loadingDecorator';
import style from './ArticleList.module.less';
import { Link } from 'react-router-dom';

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
        current: 1,
        pageSize: 10,
        total: 0,
    };

    async componentDidMount() {
        await this.fetchList();
    }

    @loading()
    async fetchList() {
        this.setState({ ifLoading: true });
        const { current, pageSize } = this.state;
        const res = await API.fetchArticles({
            page: current,
            size: pageSize,
        });
        const { total } = res;
        this.setState({
            articles: res.data,
            ifLoading: false,
            total,
        });
    }

    async onListChange(pagination) {
        const { current, pageSize } = pagination;
        this.state = {
            ...this.state,
            current,
            pageSize,
        };
        this.fetchList();
    }

    public render() {
        const { ifLoading, articles } = this.state;
        const { current, pageSize, total } = this.state;

        const ifPaginationShow = total > current * pageSize;
        const pagination = ifPaginationShow ? (
            <div
                className="flex flex-jcc"
                onClick={() => {
                    this.onListChange({ pageSize, current: current + 1 });
                }}
            >
                <span className="cp">下一页</span>
            </div>
        ) : (
            ''
        );

        const articlesTpl =
            articles.length !== 0 ? (
                articles.map(e => {
                    const { title, content } = e;
                    const abstract = content.slice(0, 300) + '\n\n' + '......';
                    return (
                        <Link to={`/article/${title}`} key={title}>
                            <div
                                key={title}
                                className={style['article-container']}
                            >
                                <h2
                                    className={classNames(
                                        'color-black',
                                        style['article-head']
                                    )}
                                >
                                    {title}
                                </h2>
                                <div
                                    className={classNames(
                                        'color-black',
                                        style['content-container']
                                    )}
                                >
                                    <ReactMarkdown source={abstract} />
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <span>暂无数据</span>
            );

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
