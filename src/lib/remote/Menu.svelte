<script lang="ts">
    import MenuItem, { type IMenuItem } from "./MenuItem.svelte";
    import { fade, slide } from "svelte/transition";
    import { ui } from "$scripts/stores";
    import { onMount } from "svelte";
    import api from "$scripts/api";

    export let title = "Demo Title";
    export let selected: null | IMenuItem = null;

    $: visible = $ui.menu;
    $: visible && onOpen();

    let items: IMenuItem[] = [];
    async function onOpen() {
        let res = await api.getCommandList();
        if (res.error) {
            alert("error on res " + res.error);

            return;
        }

        items = res.data.map((d) => ({
            icon: d.icon,
            id: d.id,
            label: d.title,
        }));
    }
    function onClose() {
        $ui.menu = false;
    }
</script>

{#if visible}
    <m-shim
        on:click={() => {
            onClose();
        }}
        transition:fade />
{/if}

{#if visible}
    <m-menu transition:slide>
        <m-title>{title}</m-title>
        <m-content>
            {#each items as item, i}
                <MenuItem
                    {item}
                    on:click={() => {
                        selected = item;
                        onClose();
                    }}
                    on:click />
            {/each}
        </m-content>
    </m-menu>
{/if}

<style lang="scss">
    m-shim {
        top: 0;
        position: fixed;

        width: 100%;
        height: 100%;
        backdrop-filter: blur(30px);
        background-color: rgba(0, 0, 0, 0.1);
    }

    m-menu {
        position: fixed;
        bottom: 0;

        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        max-height: 80%;

        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        overflow: hidden;

        background-color: #eee;
    }
    m-title {
        color: #777;

        font-size: 24px;
        height: 64px;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        display: flex;

        font-family: "Segoe UI";
    }

    m-content {
        display: flex;
        flex-direction: column;

        overflow: auto;
        // gap: 6px;
    }

    .visible {
        // display: flex;
    }
</style>
