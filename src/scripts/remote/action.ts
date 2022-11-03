import axios from "axios";
import { getBaseUrl } from "./connection";

export async function action(name: string, value?: any) {

    console.log("action", `${getBaseUrl()}/api/${name}`, { value });

    let res = await axios.post(`${getBaseUrl()}/api/${name}`, { value })

    console.log('res is ', res);

    return res.data;
}

