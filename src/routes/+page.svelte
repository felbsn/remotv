<script lang="ts">
    import "$styles/app.scss";

    import MdPowerSettingsNew from "svelte-icons/md/MdPowerSettingsNew.svelte";
    import MdVolumeMute from "svelte-icons/md/MdVolumeMute.svelte";
    import MdVolumeOff from "svelte-icons/md/MdVolumeOff.svelte";
    import MdRefresh from "svelte-icons/md/MdRefresh.svelte";

    import api from "$scripts/api";
    import Menu from "$lib/Menu.svelte";
    import Navigator from "$lib/Navigator.svelte";
    import Slider from "$lib/Slider.svelte";

    import { onMount } from "svelte";
    import ActionButton from "$lib/ActionButton.svelte";
    import type { IMenuItem } from "$lib/MenuItem.svelte";
    import { settings } from "$scripts/stores";

    let volx = 0;

    onMount(() => {
        // configureConnectionCurrent();
        // let source = new EventSource("http://localhost:3333/api/settings/sse"); //"/api/settings/sse");
        // source.onopen = () => console.log("sse open");
        // source.onmessage = (e) => {
        //     console.log("what is sse", JSON.parse(e.data));
        // };
        // register((d: any) => {
        //     console.log("incomin", d);
        //     $state = d;
        // });
        api.onSettings((s) => {
            console.log("what are my settings ", s);
            $settings = Object.assign($settings, s);
            volume = s.audio?.volume ?? 0;
        });
    });

    let selected: IMenuItem;
    let volume = 0;
    let vx = 0;

    async function onVolumeChanged(volume: number, mute = false) {
        vx = volume;
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
    {vx}

    <input
        type="range"
        min="0"
        max="100"
        bind:value={volx}
        on:change={() => {
            onVolumeChanged(volx);
        }} />
    <m-top>
        <ui-row>
            <ActionButton icon={MdPowerSettingsNew} />
            <ActionButton icon={$settings.audio?.mute ? MdVolumeOff : MdVolumeMute} />
            <ActionButton icon={MdRefresh} />
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
    on:click={() => {
        console.log("what ", selected);
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

        gap: 12px;
    }

    :global(html, body) {
        margin: 0;
        width: 100%;
        height: 100%;
    }
</style>
