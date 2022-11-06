<script lang="ts">
    import type { ICommand } from "$scripts/models/ICommand";
    import { flip } from "svelte/animate";
    import { scale } from "svelte/transition";
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";

    export let cmd: ICommand;

    if (!cmd.blockedUrls) {
        cmd.blockedUrls = [];
    }

    let blockText = "";

    function addBlockedUrl() {
        if (blockText) {
            if (!cmd.blockedUrls?.includes(blockText)) {
                cmd.blockedUrls = [...cmd.blockedUrls!, blockText];
            }
            blockText = "";
        }
    }
</script>

<m-blocks>
    <m-buttons>
        <Input
            bind:value={blockText}
            on:keydown={(e) => {
                if (e.key == "Enter") addBlockedUrl();
            }} />
        <Button on:click={addBlockedUrl}>add</Button>
    </m-buttons>
    {#if cmd.blockedUrls && cmd.blockedUrls.length > 0}
        <m-content>
            {#each cmd.blockedUrls ?? [] as blocked (blocked)}
                <m-blocked transition:scale animate:flip
                    >{blocked}
                    <m-delete
                        on:click={() => {
                            cmd.blockedUrls = cmd.blockedUrls?.filter((d) => d != blocked);
                        }}>X</m-delete>
                </m-blocked>
            {/each}
        </m-content>
    {/if}
</m-blocks>

<style lang="scss">
    m-blocks {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 12px;
        flex-wrap: wrap;
    }

    m-buttons {
        display: flex;
        flex-direction: row;
        gap: inherit;
    }

    m-content {
        display: inline-block;
        //flex-direction: row;

        gap: 6px;
    }

    m-blocked {
        background-color: whitesmoke;
        box-shadow: inset 0 -1px 4px #4447;
        border-radius: 10px;
        // min-width: 60px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 6px;
        color: rgb(130, 86, 86);
        background-color: rgb(245, 221, 221);
        margin-right: 6px;

        padding: 6px;

        position: relative;

        &:hover {
            m-delete {
                opacity: 1;
            }
        }

        m-delete {
            position: absolute;
            right: 2px;

            opacity: 0;
            transition: all 200ms;

            background: rgba(255, 0, 0, 0.811);
            border-radius: 50%;

            padding: 6px;
            width: 8px;
            height: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            cursor: pointer;

            &:hover {
                color: white;
            }
        }
    }
</style>
