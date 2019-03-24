import React from 'react';
import poster from '../../assets/background.jpg';
import style from './landscape.module.less';

export class Landscape extends React.Component {
    public render() {
        return (
            <div className={style.container}>
                <div className={style.background}>
                    <video loop={true} muted={true} poster={poster} autoPlay={true} className={style.backgroundVideo}>
                        <source src={process.env.PUBLIC_URL + '/assets/background.mp4'} type="video/mp4" />
                    </video>
                    <div className={style.mask} />
                </div>
                <div className={style.content}>
                    <span>Fulvaz Playground</span>
                </div>
            </div>
        );
    }
}

