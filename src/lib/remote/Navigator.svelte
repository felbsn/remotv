<script lang="ts" context="module">
    export type Action = "up" | "down" | "left" | "right" | "menu";
</script>

<script lang="ts">
    import MdMenu from "svelte-icons/md/MdMenu.svelte";

    import FaChevronRight from "svelte-icons/fa/FaChevronRight.svelte";
    import FaChevronLeft from "svelte-icons/fa/FaChevronLeft.svelte";
    import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
    import FaChevronUp from "svelte-icons/fa/FaChevronUp.svelte";
    import FaPowerOff from "svelte-icons/fa/FaPowerOff.svelte";

    import FaBars from "svelte-icons/fa/FaBars.svelte";
    import { createEventDispatcher } from "svelte";
    import { longPress } from "../directives/longpress";
    import { ui } from "$scripts/stores";

    export let volume: number;
    export let channel: number;

    const dispatch = createEventDispatcher<{ channel: number; volume: number }>();
</script>

<m-navigator>
    <m-wrap>
        <button
            on:click={() => {
                channel++;
                dispatch("channel", channel);
            }}>
            <m-button-content><FaChevronUp /></m-button-content>
        </button>
        <button
            use:longPress={() => {
                volume += 5;
                dispatch("volume", volume);
            }}
            ><m-button-content>
                <FaChevronRight />
            </m-button-content></button>
        <button
            use:longPress={() => {
                volume -= 5;
                dispatch("volume", volume);
            }}
            ><m-button-content>
                <FaChevronLeft />
            </m-button-content></button>
        <button
            on:click={() => {
                channel--;
                dispatch("channel", channel);
            }}>
            ><m-button-content>
                <FaChevronDown />
            </m-button-content></button>

        <m-mid on:click={() => ($ui.menu = !$ui.menu)}>
            <m-button-content class="mid">
                <FaBars />
            </m-button-content>
        </m-mid>
    </m-wrap>
</m-navigator>

<style lang="scss">
    m-navigator {
        filter: drop-shadow(0 3px 9px rgba(128, 128, 128, 0.541));
        display: flex;
        justify-content: center;
    }

    m-wrap {
        display: flex;
        position: relative;
        flex-wrap: wrap;

        width: 300px;
        height: 300px;
        overflow: hidden;
        border-radius: 50%;

        transform: rotate(45deg);

        &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: inset 0px 2px 3px #fff;
            transform: rotate(-45deg);
            pointer-events: none;
        }
        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            transform: rotate(-45deg);
            z-index: -1;
            background-image: linear-gradient(to bottom, #f7f7f7, #e7e7e7);
        }
    }

    m-mid {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 110px;
        height: 110px;
        background: #f0f0f0;

        transform: translate(-50%, -50%);
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #a7a7a7;

        border-radius: 50%;
        box-shadow: inset 0px 8px 48px #ddd;

        &:hover {
            background-color: rgb(196, 196, 196);
            color: #777;
        }

        &:active {
            background-color: rgb(196, 196, 196);
            color: #777;
        }
    }

    m-button-content {
        display: block;

        // color: red;
        // background: black;
        transform: rotate(-45deg);
        width: 60px;
        height: 60px;
        &.mid {
            display: flex;
        }
    }

    button {
        /* position: absolute; */

        background-color: transparent;

        width: 50%;
        height: 50%;

        border: none;

        display: flex;
        justify-content: center;
        align-items: center;
        color: #a7a7a7;

        &:hover {
            background-color: rgb(233, 233, 233);
            color: #555;
        }

        &:active {
            background-color: rgb(196, 196, 196);
        }
    }

    button.right {
        /* top: 50%;
        right: 0;
        box-sizing: border-box;
        width: 30%;
        height: 30%; */

        /* height: 30%; */
        /* border: 50px solid transparent; */
        /* border-right: 60px solid red; */
    }
</style>
