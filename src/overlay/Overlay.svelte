<script lang="ts">
    import api from "$scripts/api";
    import { onMount, tick } from "svelte";
    export let port: number;

    let sseStatus: "open" | "closed" | "error" = "closed";
    let state = "none";

    let rt = "";
    let parsed = "";

    async function testFetch() {
        try {
            let res = await fetch(`http://localhost:${port}`);

            let text = await res.text();
            rt = text;
        } catch (error: any) {
            console.log("error on fetch ", error);
            rt = error.toString();
        }
    }

    let order = "";

    onMount(() => {
        api.updateApiBase(`http://localhost:${port}/api`);
        api.onSettings((s) => {});
        api.onCommand(
            async (c) => {},
            () => (sseStatus = "open"),
            () => (sseStatus = "error")
        );
    });
</script>

<m-container>
    <span>{order}</span>
    <h3>{port}</h3>
    <span>sseStatus: {sseStatus}</span>
    <h1>state {state}</h1>
    <button on:click={() => "https://www.google.com"}>google</button>
    <button on:click={() => "https://www.github.com"}>github</button>
    <button on:click={testFetch}>fetch test {rt}</button>
    <span>{parsed}</span>
</m-container>

<style>
    span {
        display: flex;
        flex-wrap: wrap;
    }

    m-container {
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100%;
        width: 200px;
        z-index: 99999999;
        top: 0;
        left: 0;
        background-color: rgba(255, 246, 235, 0.194);
        backdrop-filter: blur(32px);
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
