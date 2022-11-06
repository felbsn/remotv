<script lang="ts">
    import type { ICommand } from "$scripts/models/ICommand";
    import { onMount, tick } from "svelte";
    import api from "$scripts/api";
    import Logo from "./Logo.svelte";
    import { flip } from "svelte/animate";
    import { fade, fly, scale, slide } from "svelte/transition";

    export let selected: (ICommand & { new?: true }) | null = null;
    export let commands: (ICommand & { new?: true })[];

    onMount(async () => {
        let res = await api.getCommandList();
        // if (res.data) {
        //     commands = [
        //         ...res.data,
        //         {
        //             id: Math.random().toString(),
        //             icon: "/plus-blue.png",
        //             scripts: [],
        //             title: "New *",
        //             new: true,
        //             url: "",
        //         },
        //     ];
        // }
    });

    function selectCommand(cmd: ICommand) {
        selected = cmd;
    }

    async function addCommand() {
        commands = [
            ...commands,
            {
                icon: "",
                id: Math.random().toString(),
                script: "",
                title: "New *",
                blockedUrls: [],
                new: true,
                url: "url",
            },
        ];

        await tick();

        selected = commands[commands.length - 1];
    }
</script>

<m-side>
    {#each commands as command (command.id)}
        <m-channel
            transition:scale
            animate:flip
            class:selected={command.id == selected?.id}
            class:new={command.new}
            on:click={() => selectCommand(command)}>
            <Logo url={command.icon} />

            <m-title>
                {command.title}
            </m-title>
        </m-channel>
    {/each}

    {#key commands.length}
        <m-channel on:click={addCommand} class="add" in:fade>
            <Logo url="/plus-blue.png" />

            <m-title> Add </m-title>
        </m-channel>
    {/key}
</m-side>

<style lang="scss">
    m-side {
        overflow: hidden;
        overflow-y: auto;

        // padding: 6px;

        min-width: 160px;
        max-width: 160px;

        transition: all 300ms;
        //display: grid;
        //grid-template-rows: repeat(auto-fill, 60px);

        // display: flex;
        //flex-direction: column;

        background-color: #3166b5;

        gap: 6px;

        m-channel {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 6px;

            box-sizing: border-box;
            margin: 6px;
            border: 2px solid transparent;

            max-width: 160px !important;
            overflow: hidden;

            border-radius: 28px;
            box-shadow: 0 0 12px #4444;

            background-color: white;

            cursor: pointer;

            &.selected {
                background-color: rgb(0, 187, 255);
                //background-color: rgb(158, 197, 255);
            }

            &.new {
                border: 2px dashed rgba(0, 0, 0, 0.541);
            }

            &.add {
                background-color: rgba(245, 245, 245, 0.352);
                box-shadow: none;

                &:hover {
                    background-color: rgba(245, 245, 245, 0.652);
                }
            }

            m-title {
                text-overflow: ellipsis;
                overflow: hidden;
            }

            img.icon {
                display: flex;
                width: 44px;
                height: 44px;
                // padding: 2px;

                // border: 2px solid black;
                box-shadow: 0 0 2px black;

                object-fit: fill;
                margin: 2px;

                overflow: hidden;
                border-radius: 50%;
                box-sizing: border-box;
            }
        }
    }

    @media only screen and (max-width: 600px) {
        m-title {
            display: none;
        }

        m-side {
            min-width: 70px;
        }
    }
</style>
