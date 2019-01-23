export interface ISerializer {
    serialize(data: any): string;
    deserialize(param: any): any;
}