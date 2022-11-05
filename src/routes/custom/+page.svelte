<script lang="ts">
    import api from "$scripts/api";
    import type { ICommand } from "$scripts/models/ICommand";
    import { onMount } from "svelte";
    import CommandEditor from "./CommandEditor.svelte";

    import Sidebar from "./Sidebar.svelte";

    let selected: ICommand | null;

    let commands: (ICommand & { new?: true })[] = [];

    onMount(async () => {
        let res = await api.getCommandList();
        if (res.error) {
            return;
        }

        commands = res.data;
    });
</script>

<m-main>
    <Sidebar bind:selected bind:commands />

    <m-container>
        {#if selected}
            <CommandEditor
                bind:cmd={selected}
                on:delete={(e) => {
                    commands = commands.filter((d) => d != e.detail);
                    selected = commands.length > 0 ? commands[0] : null;
                }}
                on:updated={() => {
                    commands = commands;
                }} />
        {/if}
    </m-container>
</m-main>

<style lang="scss">
    :global(body, html) {
        width: 100%;
        height: 100%;
        display: flex;
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    m-main {
        display: grid;

        flex: 1 0 0;
        grid-template-columns: auto 1fr;
        background-color: whitesmoke;
        // background-color: honeydew;
        // flex: 1 0 0;
        // flex-direction: gr;
    }

    m-container {
        display: flex;
        // background-color: darkcyan;
        flex: 1 0 0;
        box-sizing: border-box;
        justify-content: center;
        padding: max(12px, 5%);
        //width: clamp(360px, 80%, 1600px);
    }
</style>
