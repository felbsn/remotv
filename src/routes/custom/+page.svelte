<script lang="ts">
    import api from "$scripts/api";
    import type { ICommand } from "$scripts/models/ICommand";
    import { onMount } from "svelte";
    import CommandEditor from "$lib/editor/CommandEditor.svelte";
    import Sidebar from "$lib/editor/Sidebar.svelte";
    import Button from "$lib/editor/Button.svelte";
    import CircleButton from "$lib/remote/CircleButton.svelte";

    import MdPowerSettingsNew from "svelte-icons/md/MdPowerSettingsNew.svelte";
    let selected: ICommand | null;

    let commands: (ICommand & { new?: true })[] = [];

    onMount(async () => {
        let res = await api.getCommandList();
        if (res.error) {
            return;
        }

        api.onSettings((s) => {
            autoLaunchEnabled = s.app?.launchOnStartup ?? false;
        });

        commands = res.data;
    });

    async function resetCommands() {
        commands = [];
        let res = await api.importCommands([]);
        if (res.error) {
            alert("error on import");
            return;
        }
    }

    async function importCommands() {
        let file = imported?.item(0);

        if (file) {
            let txt = await file.text();
            let cmds = JSON.parse(txt);

            commands = cmds;
            let res = await api.importCommands(commands);
            if (res.error) {
                alert("error on import");
                return;
            }
        }
    }

    async function exportClick() {
        let res = await api.exportCommands();
        if (res.error) {
            alert("error on import");
            return;
        }

        download(JSON.stringify(res.data, null, "\t"), "commands.json");
    }

    function download(content: string, fileName: string, contentType = "text/plain") {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    function toggleStartup() {
        api.setSettings({
            app: {
                launchOnStartup: !autoLaunchEnabled,
            },
        });
    }

    let imported: FileList;
    let fileNode: HTMLInputElement;
    let autoLaunchEnabled = false;
</script>

<input
    style="display: none;"
    type="file"
    accept="application/json"
    bind:this={fileNode}
    bind:files={imported}
    on:change={importCommands} />

<m-nav>
    <CircleButton><MdPowerSettingsNew /></CircleButton>

    <m-right>
        <Button on:click={toggleStartup}>{autoLaunchEnabled ? "disable startup" : "enable startup"}</Button>
        <Button on:click={resetCommands}>reset</Button>
        <Button on:click={() => fileNode.click()}>import</Button>
        <Button on:click={exportClick}>export</Button>
    </m-right>
</m-nav>

<m-main>
    <Sidebar bind:selected bind:commands />

    <m-container>
        {#if selected}
            <CommandEditor
                bind:cmd={selected}
                on:delete={(e) => {
                    let found = commands.findIndex((d) => d == e.detail);
                    commands = commands.filter((d) => d != e.detail);
                    found--;
                    if (found < 0) {
                        found = 0;
                    }

                    selected = commands.length > 0 ? commands[found] : null;
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
        flex-direction: column;
    }

    m-nav {
        display: flex;
        width: 100%;
        height: 56px;
        position: sticky;
        top: 0;
        gap: 6px;
        padding: 6px;
        background: linear-gradient(to bottom, whitesmoke, white, whitesmoke);
        box-shadow: 0 0 6px #4444;
        box-sizing: border-box;

        m-right {
            display: flex;
            gap: inherit;
            margin-left: auto;
        }
    }

    m-main {
        display: grid;

        flex: 1 0 0;
        grid-template-columns: auto 1fr;
        background-color: whitesmoke;

        box-sizing: border-box;
        height: calc(100% - 56px);
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
