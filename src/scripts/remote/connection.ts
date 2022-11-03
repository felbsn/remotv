// import axios, { Axios } from "axios";


// let conn: Axios
let baseUrl: string

export function configureConnection(url: string, port?: number) {
    baseUrl = url + (port ? ":" + port : '')
    //conn = new Axios({ baseURL: baseUrl })
    console.log('connection base url ' + baseUrl);

}
export function configureConnectionLocal(port: number) {
    configureConnection("http://localhost", port);
}

export function configureConnectionCurrent() {
    configureConnection(location.origin);
}

export function getBaseUrl() {
    return baseUrl;
}

// export function getConnection() {
//     return conn;
// }


