// import { Request } from "node-fetch";

// export type Collection<T> = {
//     [key : string]: T;
// } & {
//     zCollection : T;
//     zArray : T[];
// };

// export interface Service {
//     zFixture : never;
// }

// export interface ResolvableNamedCollection<CollectionT> extends Service {
//     $names : string[];
//     $all : CollectionT;
// }

// export interface Requestable<T> {
//     $post(request : Request) : Promise<T>;
//     $put(value : T, request : Request) : Promise<T>;
//     $get(request : Request) : Promise<T>;
// }

// export interface RequestableCollection<T> {
//     $put(value : T, request : Request) : Promise<T>;
//     (key : string) : Resource<T>;
// }

// export interface Resource<T> {
//     $get(request : Request) : Promise<T>;
//     $post(data : T, request? : Request);
//     $delete(request? : Request) : Promise<T>;
// }


// export type Callable<T> = 
//     {
//         [P in keyof T]: (
//             T[P] extends Collection<any> ? CollectionEndpoint<T[P]>
//             : T[P] extends Service ? Callable<T[P]>
//             : Endpoint<T[P]>
//         );
//     }
// ;

// export type Endpoint<T> = Callable<T> & Promise<T> & Requestable<T>;
// export type CollectionEndpoint<CollectionT> = Callable<CollectionT> & Promise<T[]> & RequestableCollection<T>;
// export type ResourceEndpoint<T> = Callable<T> & Promise<T> & Resource<T>;

// export interface AbbreviatedShow {
//     id : string;
//     name : string;
// }

// export interface Show {
//     id : string;
//     name : string;
// }

// export interface ContentAPI extends Service {
//     shows : Collection<Show, AbbreviatedShow>;
//     stuff : string;
// }

// export interface API extends Service {
//     content : ContentAPI;
// }

// async function main() {
//     let callableService : Callable<API>;
//     let foo = await callableService.content.shows;
// }