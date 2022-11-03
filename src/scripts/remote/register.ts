import { getBaseUrl } from "./connection";


export async function register(act: (d: any) => void, err?: (e: Event) => void) {
  let es = new EventSource(`${getBaseUrl()}/api/sse`);
  es.onmessage = (e) => {
    let data = JSON.parse(e.data);
    act(data)
  };
  es.onerror = (e) => {
    err?.call(null, e);
  }
}