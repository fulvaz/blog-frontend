import React, { Component } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageTitle } from '../../components/PageLayout/PageTitle';
import { PageContent } from '../../components/PageLayout/PageContent';
import { urlState, changeUrl, fetchApi } from '../../utils/urlState/decorator';

@urlState({
    stringify: (data) => {
        const {
            search,
        } = data;
        return {
            // 表示url中用searchInParam表示this.state.search
            // 如this.state.search为'abc', 则改变筛选条件后, url会变成: path?searchInParam=abc
            searchInParam: search,
        };
    },
    parse: (param) => {
        const {searchInParam} = param;
        return {
            // 获取url中的searchInParam字段, 然后还原给search
            search: searchInParam,
        }
    }
})
export class CustomFilter extends Component {
    state = {
        search: '',
    };

    @changeUrl()
    onChange(e) {
        const {value: search} = e.target;
        this.setState({search});
    }

    @fetchApi({deps: ['search']})
    fetch() {
        console.log('fetching data');
    }

    render() {
        return (
            <PageLayout ifBackShow={true}>
                <PageTitle>后端筛选</PageTitle>
                <PageContent>
                    <input type="text" value={this.state.search} onChange={this.onChange.bind(this)}/>
                    <span>your input: {this.state.search}</span>
                </PageContent>
            </PageLayout>
        );
    }
}
