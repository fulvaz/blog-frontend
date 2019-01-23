import { ISynchronizer } from './synchronizer.interface';

export class CommonSynchronizer implements ISynchronizer {
    restoreUI(componentInstance: any, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            componentInstance.setState(data, () => {
                resolve();
            });
        });
    }

    appendParams(componentInstance, paramsString: any) {
        componentInstance.props.history.push(`${paramsString}`);
    }
    restoreState(componentInstance, data: any) {
        componentInstance.state = {
            ...data,
        };
    }
}
