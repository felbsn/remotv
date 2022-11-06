<script lang="ts">
    import "$styles/app.scss";

    import MdPowerSettingsNew from "svelte-icons/md/MdPowerSettingsNew.svelte";
    import MdVolumeMute from "svelte-icons/md/MdVolumeMute.svelte";
    import MdVolumeOff from "svelte-icons/md/MdVolumeOff.svelte";
    import MdRefresh from "svelte-icons/md/MdRefresh.svelte";

    import api from "$scripts/api";
    import Menu from "$lib/remote/Menu.svelte";
    import Navigator from "$lib/remote/Navigator.svelte";
    import Slider from "$lib/remote/Slider.svelte";

    import { onMount } from "svelte";
    import Button from "$lib/remote/CircleButton.svelte";
    import type { IMenuItem } from "$lib/remote/MenuItem.svelte";
    import { settings } from "$scripts/stores";

    let volx = 0;

    onMount(() => {
        api.onSettings((s) => {
            console.log("what are my settings ", s);
            $settings = Object.assign($settings, s);
            volume = s.audio?.volume ?? 0;
        });
    });

    let selected: IMenuItem;
    let volume = 0;

    async function onVolumeChanged(volume: number, mute = false) {
        try {
            await api.setSettings({
                audio: {
                    volume,
                    mute,
                },
            });
        } catch (error) {
            console.error("olmadi ", error);
        }
    }
</script>

<svelte:head>
    <title>Kumanda</title>
</svelte:head>

<main>
    <m-top>
        <ui-row>
            <Button
                big
                icon={MdPowerSettingsNew}
                on:click={() => {
                    api.setSettings({
                        shutdown: {
                            timeout: 0,
                        },
                    });
                }} />
            <Button
                big
                icon={$settings.audio?.mute ? MdVolumeOff : MdVolumeMute}
                on:click={() => {
                    api.setSettings({
                        audio: {
                            mute: !$settings.audio?.mute,
                            volume: volume,
                        },
                    });
                }} />
            <Button big icon={MdRefresh} />
        </ui-row>
    </m-top>
    <m-bottom>
        <Slider
            bind:value={volume}
            on:change={async () => {
                let val = volume;
                await onVolumeChanged(val);
            }} />
        <Navigator
            channel={$settings.command.index}
            {volume}
            on:channel={(c) => {
                console.log("what is channel", c.detail);
            }}
            on:volume={async (e) => {
                await onVolumeChanged(e.detail);
            }} />
    </m-bottom>
</main>

<Menu
    title="Kanallar"
    bind:selected
    on:click={async () => {
        await api.runCommandExact(selected);
    }} />

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
            "Helvetica Neue", sans-serif;
    }

    main {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: relative;
        flex-grow: 1;
        flex-grow: 0;
        flex-shrink: 0;

        overflow: hidden;
    }

    m-top {
        width: 100%;
        flex-grow: 1;
    }

    m-bottom {
        /* margin-top: auto; */
        width: 100%;
        /* flex-basis: 12; */
        align-items: center;
        justify-content: center;
        padding: 12px;
        flex-shrink: 0;
        height: fit-content;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        gap: 12px;
    }

    ui-row {
        display: flex;
        flex-direction: row;
        gap: 12px;
        box-sizing: border-box;
        padding: 12px;
    }

    :global(html, body) {
        margin: 0;
        width: 100%;
        height: 100%;
    }

    :global(html) {
        color: #444;
        font-size: 100%;
        background: #f7f7f7 url(/bg.png) repeat center top;
    }

    :global(body) {
        font-family: Cambria, Georgia, "Times New Roman", Times, serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        font-size: 18px;
        font-size: 1.125rem;
        line-height: 1.5;
    }
</style>
