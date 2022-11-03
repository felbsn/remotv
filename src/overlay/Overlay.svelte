<script lang="ts">
    import api from "$scripts/api";
    import { onMount } from "svelte";

    import txt from "./prebundle.js.txt";
    console.log("txt is ", txt);

    let url = "";

    let sseStatus: "open" | "closed" | "error" = "closed";
    let state = "none";

    let onfinishload = () => {};

    let rt = "";
    let parsed = "";

    async function testFetch() {
        try {
            let res = await fetch("http://localhost:3333");

            let text = await res.text();
            rt = text;
        } catch (error: any) {
            console.log("error on fetch ", error);
            rt = error.toString();
        }
    }

    onMount(() => {
        api.onCommand(
            async (c) => {
                ensureInit();
                parsed = c.title;

                if (c.url) {
                    //if (url != c.url) {
                    url = c.url;
                    webview.loadURL(url);
                    onfinishload = async () => {
                        console.log("executing scripts");
                        onfinishload = () => {};
                        for (const script of c.scripts) {
                            let s = scriptTemplate.replace("%script%", script);
                            await webview.executeJavaScript(s, true);
                        }
                    };
                    //}
                } else {
                    console.log("executing scripts");
                    onfinishload = () => {};
                    for (const script of c.scripts) {
                        await webview.executeJavaScript(script, true);
                    }
                }
            },
            () => (sseStatus = "open"),
            () => (sseStatus = "error")
        );
        // let source = new EventSource("http://localhost:3333/overlay");
        // source.onerror = () => {
        //     sseStatus = "error";
        // };
        // source.onopen = () => {
        //     sseStatus = "open";
        // };
        // source.onmessage = (e) => {
        //     let d = JSON.parse(e.data);
        //     parsed = e.data;
        // };
    });

    let _initialized = false;
    function ensureInit() {
        if (_initialized || !webview) return _initialized;

        _initialized = true;
        let evs: events[] = ["did-finish-load", "dom-ready", "did-start-loading", "did-stop-loading"];
        for (const ev of evs) {
            webview.addEventListener(ev, () => {
                state = ev;
                if (ev == "did-stop-loading") {
                    onfinishload();
                }
            });
        }
    }

    const scriptTemplate = `
    new Promise(async (r) => {
    try {
        function click(selector) {
            let found = document.querySelector(selector);
            found?.click();
        };
        function delay(duration) {
            return new Promise((r) => setTimeout(r, duration));
        };
        function hide(selector) {
            let found = document.querySelector(selector);
            if (found) {
                found.style.display = "none";
            }
        };

        %script%

    } catch (error) {

    }
    r(true);
});`;
</script>

<m-container>
    <span>sseStatus: {sseStatus}</span>
    <h1>state {state}</h1>
    <button on:click={() => webview.loadURL("https://www.google.com")}>google</button>
    <button on:click={() => webview.loadURL("https://www.github.com")}>github</button>
    <button on:click={testFetch}>fetch test {rt}</button>
    <span>{parsed}</span>
</m-container>

<style>
    m-container {
        display: flex;
        flex-direction: column;
        height: 400px;
        width: 100px;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(165, 42, 42, 0.129);
    }

    h1 {
        background-color: pink;
        border-radius: 12px;
        padding: 10px;

        top: 0;
        left: 0;
        height: 40px;
        width: 80px;
    }
</style>
