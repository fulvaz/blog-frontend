import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from 'react-router-dom';
import * as style from './Article.module.less';
import { API } from '../../utils/api';
import { loading } from '../../utils/loadingDecorator';
import { Spin } from 'antd';

interface IURLParam {
    id: string;
}

// const articles = [
//     {
//         id: 0,
//         title: '标题1',
//         date: new Date(),
//         content:
//             'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem '
//     },
//     {
//         id: 1,
//         title: '标题1',
//         date: new Date(),
//         content:
//             'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem '
//     },
//     {
//         id: 2,
//         title: '标题1',
//         date: new Date(),
//         content:
//             'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem '
//     }
// ];

export class Article extends React.Component<RouteComponentProps<IURLParam>> {
    public articleId: string;
    public state = {
        articleId: '',
        article: {},
        ifLoading: false,
    };

    public async componentDidMount() {
        const { id } = (this.props.match as any).params;
        this.state.articleId = id;
        this.getData();
    }

    @loading()
    public async getData() {
        const { articleId: id } = this.state;
        const res = await API.fetchArticle({ id });
        this.setState({
            article: res.data,
    });
    }

    public render() {
        const { ifLoading } = this.state;
        const article: any = this.state.article || {};
        return (
            <div className={style.container}>
                <Spin spinning={ifLoading}>
                    <h2>
                        <span>{article.title}</span>
                    </h2>
                    <ReactMarkdown source={article.content} />
                </Spin>
            </div>
        );
    }
}
