<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import MdPowerSettingsNew from "svelte-icons/md/MdPowerSettingsNew.svelte";
    import MdSettings from "svelte-icons/md/MdSettings.svelte";
    import MdRefresh from "svelte-icons/md/MdRefresh.svelte";
    import CircleButton from "$lib/remote/CircleButton.svelte";
    import Slider from "$lib/remote/Slider.svelte";
    import type { ICommand } from "$scripts/models/ICommand";
    import api from "$scripts/api";
    import IoIosVolumeHigh from "svelte-icons/io/IoIosVolumeHigh.svelte";
    import qrcode from "qrcode";
    import MdVolumeMute from "svelte-icons/md/MdVolumeMute.svelte";
    import MdVolumeOff from "svelte-icons/md/MdVolumeOff.svelte";
    import StatusLight from "$lib/StatusLight.svelte";
    import { scale } from "svelte/transition";
    import { goto } from "$app/navigation";

    export let port: number;

    let volume = 50;
    let mute = false;
    let items: ICommand[] = [];
    let visible = false;
    let fullvisible = false;

    let appUrlQr: string = "http://127.0.0.1:2000/test";
    let appUrl: string = "http://127.0.0.1:2000/test";

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
        //visible = false;
    }

    onMount(async () => {
        console.warn("$$$$$$$$$$$$$$$$$$ my port is wrong or what?" + port);
        api.updateApiBase(`http://localhost:${port}/api`);

        await fetchCommands();

        register();

        console.log("mounted overlay");

        //@ts-ignore
        pointermove({
            clientX: 0,
        });
    });

    function register() {
        let before = api.onSettings(
            async (s) => {
                console.warn("updated settings", s);

                volume = s.audio.volume;
                mute = s.audio.mute;

                if (appUrl != s.appUrl) {
                    appUrl = s.appUrl;
                    appUrlQr = await qrcode.toDataURL(s.appUrl, {
                        margin: 0,
                        width: 360,
                    });
                }
            },
            (ev) => {
                state = "ok";
            },
            (ev) => {
                state = "err";
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
    let state: "warn" | "ok" | "err" = "warn";
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
</m-sidebar>

<m-settings class:visible on:click|stopPropagation>
    <CircleButton
        big={false}
        icon={MdSettings}
        on:click={() => {
            goto("/custom");
        }} />

    <CircleButton big={false} icon={MdPowerSettingsNew} on:click={shutdownCommand} />
    <CircleButton big={false} icon={MdRefresh} on:click={fetchCommands} />
    <!-- <CircleButton icon={mute ? MdVolumeOff : MdVolumeMute} on:click={toggleMute} /> -->

    <Slider
        bind:value={volume}
        on:change={() => {
            volumeCommand();
        }} />
</m-settings>

<m-qr class:visible={visible || qrPin} class:pinned={qrPin} on:click|capture|stopPropagation={() => (qrPin = !qrPin)}>
    <img src={appUrlQr} alt="" />
    <m-qr-text>
        <span>Remotv</span>
        <a href={appUrl}>{appUrl}</a>
    </m-qr-text>
</m-qr>

<StatusLight {state} />

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

        z-index: 90 !important ;
        left: 0 !important;
        top: 0 !important;

        transition: all 300ms;
        overflow-y: auto;

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

        &::-webkit-scrollbar {
            // height: 14px !important;
            width: 14px !important;
            background: rgba(0, 0, 0, 0.164) !important;
            border-radius: 6px !important;
        }

        &::-webkit-scrollbar-thumb {
            background: #9e9e9e8e;
            border: 2px transparent solid;
            background-clip: padding-box;
            border-radius: 6px !important;
        }

        &::-webkit-scrollbar-corner {
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
        top: 16px;
        //right: 440px;
        left: 50%;
        transform: translate(-50%);
        cursor: pointer;

        display: flex;
        flex-direction: row;
        align-items: center;

        height: 48px;
        width: 260px;
        width: 220px;
        // width: 160px;
        background-color: white;
        border-radius: 12px;

        box-shadow: 0 0 6px #4444;

        opacity: 0 !important;
        transition: all 200ms;

        overflow: hidden;
        &.visible {
            opacity: 1 !important;
        }

        img {
            padding: 2px;
        }

        &.pinned,
        &:hover {
            flex-direction: column;
            //align-items: stretch;

            height: 440px;
            width: 400px;

            box-shadow: 0 0 12px blue;

            img {
                padding: 16px;
            }

            m-qr-text {
                padding-bottom: 10px;
            }
        }

        &:hover::after,
        &.pinned::after {
            content: "Click to pin";
            position: absolute;
            top: calc(100% + 10px);

            display: flex;
            color: rgb(88, 88, 88);
            text-shadow: 0 0 4px whitesmoke;
            font-size: 24px;

            width: 100%;
            justify-content: center;
        }
        &.pinned::after {
            content: "Click to unlock";
        }

        &.pinned {
            outline: 3px solid blue;
        }

        m-qr-text {
            color: black;
            text-align: center;
            //padding: 0;
            // height: 40px;
            display: grid;
            place-items: center;
            box-sizing: border-box;

            a,
            span {
                color: black;
            }

            width: 100%;
        }

        img {
            height: 100%;
            display: flex;
            //background-color: red;
            box-sizing: border-box;
            cursor: none;
        }
    }
</style>
