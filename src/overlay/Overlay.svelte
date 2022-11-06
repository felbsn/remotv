<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import MdPowerSettingsNew from "svelte-icons/md/MdPowerSettingsNew.svelte";
    import MdRefresh from "svelte-icons/md/MdRefresh.svelte";
    import CircleButton from "$lib/remote/CircleButton.svelte";
    import Slider from "$lib/remote/Slider.svelte";
    import type { ICommand } from "$scripts/models/ICommand";
    import api from "$scripts/api";
    import IoIosVolumeHigh from "svelte-icons/io/IoIosVolumeHigh.svelte";
    import qrcode from "qrcode";
    import MdVolumeMute from "svelte-icons/md/MdVolumeMute.svelte";
    import MdVolumeOff from "svelte-icons/md/MdVolumeOff.svelte";

    export let port: number;

    let volume = 50;
    let mute = false;
    let items: ICommand[] = [];
    let visible = false;
    let fullvisible = false;

    let sseState = "";
    // let source: EventSource | null = null;

    //console.log("my event source is ", source);

    let appUrl: string = "";

    const IDLE_TIME = 2_000;
    let timeout = 0;
    function pointermove(e: PointerEvent) {
        visible = true;

        if (timeout) clearTimeout(timeout);

        timeout = window.setTimeout(() => {
            visible = false;
            fullvisible = false;
            timeout = 0;
        }, IDLE_TIME);

        if (e.clientX < 50) {
            fullvisible = true;
        } else if (e.clientX > 500) {
            fullvisible = false;
        }
    }

    async function itemselected(value: ICommand) {
        api.runCommandExact(value);
        visible = false;
    }

    onMount(async () => {
        console.warn("$$$$$$$$$$$$$$$$$$ my port is wrong or what?" + port);
        api.updateApiBase(`http://localhost:${port}/api`);

        await fetchCommands();

        register();

        console.log("mounted overlay");
    });

    function register() {
        console.warn("$$$$$$$$$$$$$$$$$$ registering..." + port);
        let before = api.onSettings(
            async (s) => {
                console.warn("updated settings", s);

                volume = s.audio.volume;
                mute = s.audio.mute;

                if (!appUrl) {
                    appUrl = await qrcode.toDataURL(s.appUrl);
                }
            },
            (ev) => {
                console.warn("$$$$$$$$$$$$ OPEN ", ev);
                sseState = "open";
            },
            (ev) => {
                console.warn("$$$$$$$$$$$$ ERROR", ev);
                sseState = "err";

                before.close();

                setTimeout(() => {
                    register();
                }, 1_000);
            }
        );
    }

    async function fetchCommands() {
        let res = await api.getCommandList();
        if (res.error) {
            console.error("error on get commands", res.error);
            return;
        }
        items = res.data;
    }

    async function shutdownCommand() {
        api.setSettings({ shutdown: { timeout: 0 } });
    }

    async function volumeCommand() {
        api.setSettings({ audio: { volume: volume, mute: false } });
    }
    async function toggleMute() {
        api.setSettings({ audio: { volume: volume, mute: !mute } });
    }

    visible = true;
    let qrPin = false;
</script>

<svelte:window on:pointermove={pointermove} />

<m-sidebar class:visible class:fullvisible on:click|stopPropagation>
    <m-title>Kanallar</m-title>
    <hr />
    <m-commands>
        {#each items as item}
            <m-item on:click={() => itemselected(item)}>
                <img src={item.icon} alt="" />
                <m-item-text>{item.title}</m-item-text>
            </m-item>
        {/each}
    </m-commands>

    <h2>{sseState}</h2>
</m-sidebar>

<m-settings class:visible on:click|stopPropagation>
    <CircleButton big={false} icon={MdPowerSettingsNew} on:click={shutdownCommand} />
    <CircleButton big={false} icon={MdRefresh} on:click={fetchCommands} />
    <CircleButton icon={mute ? MdVolumeOff : MdVolumeMute} on:click={toggleMute} />

    <Slider
        bind:value={volume}
        on:change={() => {
            volumeCommand();
        }} />
</m-settings>

<m-qr class:visible={visible || qrPin} class:pinned={qrPin} on:click|capture|stopPropagation={() => (qrPin = !qrPin)}>
    <img src={appUrl} alt="" />
</m-qr>

<style lang="scss">
    * {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: white;
    }

    hr {
        margin: 4px;
        margin-left: -6px;
        margin-right: -6px;
    }

    m-sidebar {
        position: fixed !important ;

        z-index: 2147483647 !important ;
        left: 0 !important;
        top: 0 !important;

        transition: all 300ms;

        //opacity: 0;

        width: 160px;
        width: 60px;
        width: 0px;
        padding: 0px;

        &.visible {
            width: 60px;
            padding: 6px;
        }

        &.fullvisible {
            width: 200px;
        }

        height: 100%;
        box-sizing: border-box;
        background-color: #0004;
        backdrop-filter: blur(24px);

        display: flex;
        flex-direction: column;

        m-title {
            font-size: 22px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        m-commands {
            display: flex;
            flex-direction: column;
            gap: 6px;

            m-item {
                display: flex;
                flex-direction: row;
                height: 48px;
                overflow: hidden;
                background-color: #0004;
                border-radius: 6px;

                cursor: pointer;

                &:hover {
                    background-color: #fff4;
                }

                img {
                    display: flex;
                    height: 48px;
                    width: 48px;
                    flex-shrink: 0;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    object-fit: scale-down;
                    //  padding: 4px;
                    box-sizing: border-box;
                }

                m-item-text {
                    display: flex;
                    font-size: 22px;
                    align-items: center;
                    padding: 0 12px;
                }
            }
        }

        ::-webkit-scrollbar {
            // height: 14px !important;
            width: 14px !important;
            background: rgba(0, 0, 0, 0.164) !important;
            border-radius: 6px !important;
        }

        ::-webkit-scrollbar-thumb {
            background: #9e9e9e8e;
            border: 2px transparent solid;
            background-clip: padding-box;
            border-radius: 6px !important;
        }

        ::-webkit-scrollbar-corner {
            background: rgba(0, 0, 0, 0.137) !important;
        }
    }

    m-settings {
        position: fixed !important;
        z-index: 99999 !important ;
        right: 0 !important;
        top: 0 !important;
        width: 400px !important;
        height: 60px !important;
        padding: 10px !important;

        display: flex !important;
        gap: 10px !important;

        box-sizing: content-box !important;

        flex-direction: row !important;
        align-items: center !important;
        opacity: 0 !important;
        transition: all 0.3s !important;
        &.visible {
            opacity: 1 !important;
        }
    }

    m-qr {
        position: fixed !important;
        z-index: 99999 !important ;
        bottom: 12px;
        right: 12px;
        cursor: pointer;

        display: flex;

        height: 120px;
        width: 120px;
        background-color: whitesmoke;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 0 6px #4444;

        opacity: 0 !important;
        transition: all 200ms;
        &.visible {
            opacity: 1 !important;
        }

        &.pinned,
        &:hover {
            height: 200px;
            width: 200px;
        }
    }
</style>
