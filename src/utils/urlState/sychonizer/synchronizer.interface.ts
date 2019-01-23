export interface ISynchronizer {
    appendParams(componentInstance: any, params: any);
    restoreState(componentInstance: any, data: any);
    // 在部分框架中, 如react, 更新状态不一定更新UI, 这个方法会触发UI更新
    restoreUI(componentInstance: any, data: any): Promise<void>;
}
