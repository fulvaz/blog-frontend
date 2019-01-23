import { ISynchronizer } from './synchronizer.interface';
import { UrlStateConfig } from '../urlStateFactory';

export class DvaSynchronizer implements ISynchronizer {
    constructor(private config: UrlStateConfig) {}

    restoreUI(componentInstance: any, data: any): Promise<void> {
        const { dvaNamespace, dvaFilterEvent } = this.config;
        componentInstance.props.dispatch({
            type: `${dvaNamespace}/${dvaFilterEvent}`,
            payload: data,
        });
        return Promise.resolve();
    }

    appendParams(componentInstance, paramsString: any) {
        componentInstance.props.history.push(`${paramsString}`);
    }
    restoreState(componentInstance, data: any) {
        const { dvaNamespace, dvaFilterEvent } = this.config;
        componentInstance.props.dispatch({
            type: `${dvaNamespace}/${dvaFilterEvent}`,
            payload: data,
        });
    }
}
