export class Tools {
    public static getCookie(key: string, forceCookie: boolean = false) {
        if (localStorage && !forceCookie) {
            const value = localStorage.getItem(key);
            if (value) {
                return value;
            }
        }
        // 从cookie里面取
        const reg = new RegExp(key + '=([^;]*)');
        const m = document.cookie.match(reg);
        if (m && m.length > 1) {
            return m[1];
        }
        return null;
    }

    public static setCookie(
        key: string,
        data: string,
        useCookie?: boolean,
        time?: any,
        path?: any
    ) {
        if (localStorage && !useCookie) {
            try {
                localStorage.setItem(key, data);
                return;
            } catch (err) {
                // 在safari的匿名模式的时候会报错
                // go ahead
            }
        }
        const exp = new Date();

        if (time) {
            exp.setTime(exp.getTime() + time);
        } else {
            exp.setTime(exp.getTime() + 23.9 * 60 * 60 * 1000);
        }
        if (path) {
            document.cookie =
                key +
                '=' +
                data +
                ';expires=' +
                exp.toUTCString() +
                ';path=' +
                path;
            return;
        }
        document.cookie = key + '=' + data + ';expires=' + exp.toUTCString();
    }

    public static removeCookie(key: string, forceCookie = false) {
        if (localStorage && !forceCookie) {
            localStorage.removeItem(key);
        }
        const exp = new Date();
        exp.setTime(exp.getTime() - 1);
        // 应该要清得彻底一点
        const value = this.getCookie(key, true);
        if (value !== null) {
            document.cookie =
                key + '=' + value + ';expires=' + exp.toUTCString();
        }
    }

    // 允许返回的跳转方式
    public static jumpTo(url) {
        // 如果将打包结果部署到localhost, 那么不会发生跳转
        // 用127.0.0.1访问即可正常跳转
        history.pushState(null, document.title, location.href);
        location.href = url;
    }

    // 使用这个函数务必加上注释
    public static nextTick(cb) {
        setTimeout(cb, 0);
    }

    public static encodeBase64(str) {
        return btoa(encodeURIComponent(str));
    }

    public static decodeBase64(str) {
        return atob(decodeURIComponent(str));
    }

    public static removeUndefinedyObjMember(state): any {
        const validKeys = Object.keys(state).filter(
            k => state[k] !== undefined
        );
        return {
            ...validKeys.reduce((p, k) => {
                return {
                    ...p,
                    [k]: state[k],
                };
            }, {}),
        };
    }
}
