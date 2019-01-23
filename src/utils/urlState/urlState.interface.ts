export interface IUrlState {
    handleInit(componentInstance: any);
    handleUrlParamsChange(
        componentInstance: any,
        prevSearch: string,
        currentSearch: string
    );
    saveInitState(componentInstance: any);
    changeUrlParams(componentInstance: any);
}

// 声明构造器
// declare var IUrlState: {
//     new (serializer: ISerializer, synchronizer: ISynchronizer): IUrlState;
//     (serializer: ISerializer, synchronizer: ISynchronizer): IUrlState;
// };
