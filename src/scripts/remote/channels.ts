import axios from "axios";
import { getBaseUrl } from "./connection";

export async function channels() {

    let url = `${getBaseUrl()}/api/channel`;
    console.log('hehehe', url);

    let res = await axios.get(url)
    console.log("INCOMING RES ", res)

    return res.data as { label: string; icon: string; value: any }[];
}

