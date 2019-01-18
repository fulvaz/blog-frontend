/**
 * @method ObjectToParamsObj
 * @param {Object} node 需要遍历的节点,支持递归多层级遍历
 * @param {string} namespace 命名空间
 * @param {string} filter filters中的某一项
 * @const {Object} obj 返回值 结果为paramsObj
 * @const {Array} nodeKeys 原始node节点中符合filter的节点
 * @const {string} keyname 遍历节点的key值 格式为 namespace-filter-a-b...-e-f
 * @return {Object} 返回遍历的结果，将多级node处理成 {namespac-filter-a-b...-e-f: value} 格式
 * @description 将多层级的object处理为paramsObj
 */
export function ObjectToParamsObj(node: {}, namespace: string, filter?: string) {
    const obj = {};
    const nodeKeys = Object.keys(node).filter((key) => {
        return !filter ? typeof node[key] !== 'function' : key === filter;
    });
    nodeKeys.forEach((key) => {
        const keyname = `${namespace}-${key}`; //生成keyname a-b-c
        if (typeof node[key] !== `object`) {
            //非object 直接赋值
            obj[keyname] = node[key] ? node[key] : null;
        } else {
            //object 数组和object，数组直接赋值并转成字符串，数组与字符串不好互相转化
            if (Array.isArray(node[key])) {
                obj[keyname] = node[key].length > 0 ? node[key].join(`,`) : null;
            } else {
                const child = ObjectToParamsObj(node[key], keyname);
                Object.assign(obj, child);
            }
        }
    });
    return obj;
}

/**
 * @method ParamsObjToObject
 * @param {Object} paramsObj 格式为{namespac-filter-a-b...-e-f: value}
 * @param {string} namespace 命名空间
 * @const {Array} paramsObjKeys paramsObj对象的有效key值，通过namespace进行筛选
 * @const {string} filter filters中的某一项
 * @const {Object} obj 返回值
 * @const {Array} keynames 去除namespace后的层级关系[filter,a,b,...,e,f]
 * @const {string} keyname 遍历节点的key值 格式为 namespace-filter-a-b...-e-f
 * @return {Object} 将多层级的object
 * @description 将paramsObj处理成多层级的object
 */
export function ParamsObjToObject(paramsObj: {}, namespace?: string) {
    const obj = {};
    const paramsObjKeys = Object.keys(paramsObj).filter((key) => {
        return !namespace ? true : key.indexOf(namespace) === 0;
    });

    paramsObjKeys.forEach((key: string) => {
        const keynames = key.split(`-`);
        keynames.splice(0, 1); // 去除namespace前缀 namespace-a-b-c [a,b,c]
        const filter = keynames[0]; //拿到filter，params格式为 namespace-filter,去掉namespace就拿到了filter

        if (obj[filter]) {
            //需要合并
            const child = ParamsObjKeyToChildObj(keynames, paramsObj[key]);
            obj[filter] = AssignObject(obj[filter], child[filter]);
        } else {
            //不需要合并
            const origin = ParamsObjKeyToChildObj(keynames, paramsObj[key]);
            obj[filter] = origin[filter]; //取到filter的值，赋值
        }
    });
    return obj;
}

/**
 * @method ParamsObjKeyToChildObj
 * @param {Array} paramsObjKeys 去除namespace后的 paramsObj key值[]
 * @param {any} value paramsObj key 对应的值
 * @const {Object} obj 返回值 childObj
 * @return {Object} 返回childObj
 * @description 将paramsObj 处理成为合并前的object ,简称childObj，childObj可以是一个多层级object
 */
export function ParamsObjKeyToChildObj(paramsObjKeys: string[], value: any) {
    const obj = {};
    if (paramsObjKeys.length === 1) {
        obj[paramsObjKeys[0]] = ReduceValue(value);
        return obj;
    }
    paramsObjKeys.forEach((key, i) => {
        const index = paramsObjKeys.length - 1 - i;
        const keyname = paramsObjKeys[index];
        const childkeyname = paramsObjKeys[index + 1];
        if (i === 0) {
            obj[keyname] = value;
        } else {
            obj[keyname] = {}; //创建父级
            obj[keyname][childkeyname] = obj[childkeyname]; //将子级赋值父级
            delete obj[childkeyname]; //删除子级
        }
    });
    return obj;
}

/**
 * @method AssignObject
 * @param {Object} origin 去除namespace后的 paramsObj key值[]
 * @param {Object} child paramsObj key 对应的值
 * @return {Object} 返回多层级的object
 * @description 将childObj 合并，本质上是object对象合并
 */
export function AssignObject(origin: any, child: any) {
    //不是object就赋值
    if (typeof origin !== 'object' || Array.isArray(origin)) {
        return child;
    }
    if (typeof child !== 'object' || Array.isArray(child)) {
        return child;
    }

    const origin_bak = JSON.parse(JSON.stringify(origin)); //复制原始object,此处不严谨
    const origin_bak_keys = Object.keys(origin_bak); //原始object的key值
    const child_keys = Object.keys(child); //子对象的key值
    child_keys.forEach((child_key) => {
        //判断是否存在相同的key值
        if (origin_bak_keys.indexOf(child_key) === -1) {
            origin_bak[child_key] = child[child_key];
        } else {
            origin_bak[child_key] = AssignObject(origin_bak[child_key], child[child_key]);
        }
    });
    return origin_bak;
}

/**
 * @method ReduceValue
 * @param {any} value 去除namespace后的 paramsObj key值[]
 * @return {any} 返回处理后的value
 * @description 将value进行处理，将默认的字符串处理为 number、boolean，数组暂时不处理
 */
export function ReduceValue(value: any) {
    if (value === 'null') {
        return null;
    }
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    if (!Number.isNaN(Number(value))) {
        return Number(value);
    }
    return value;
}

/**
 * @method ParamsToParamsObj
 * @param {any} params 伪数组
 * @return {Object} 返回paramsObj
 * @description 将params进行处理，生成paramsObj
 */
export function ParamsToParamsObj(params: any) {
    const obj = {};
    params.forEach((value, key) => {
        obj[key] = ReduceValue(value);
    });
    return obj;
}

/**
 * @method JudgeParamsStatus
 * @param {string} namespace 命名空间
 * @param {string} filter filters中的某一项
 * @param {Object} currParams 最新params 格式为paramsObj
 * @param {Object} prevParams 上一次params 格式为paramsObj
 * @return {boolean} 返回是否变化的状态
 * @description 对当前url和上一次url进行对比
 */
export function JudgeParamsStatus(namespace: string, filter: string, currParams: {}, prevParams: {}) {
    const currkes = Object.keys(currParams).filter((key) => {
        return key.indexOf(`${namespace}-${filter}`) === 0;
    });
    const prevkes = Object.keys(prevParams).filter((key) => {
        return key.indexOf(`${namespace}-${filter}`) === 0;
    });
    if (currkes.length !== prevkes.length) {
        return true;
    }

    const differs = currkes.concat(prevkes).filter((key) => {
        return currParams[key] !== prevParams[key];
    });
    return differs.length > 0 ? true : false;
}

/**
 * @method CreateParamsByFilters
 * @param {Object} state 原始state/props
 * @param {Array} filters filters
 * @return {Object} 返回是否变化的状态
 * @description 返回相关的数据
 */
export function CreateParamsByFilters(state: {}, filters: any[]) {
    const obj = {};
    filters.forEach((filter) => {
        obj[filter] = state[filter] ? state[filter] : null;
    });
    return obj;
}
