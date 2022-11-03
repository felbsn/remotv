<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import FaVolumeUp from "svelte-icons/fa/FaVolumeUp.svelte";
    import IoIosVolumeHigh from "svelte-icons/io/IoIosVolumeHigh.svelte";
    import IoIosVolumeLow from "svelte-icons/io/IoIosVolumeLow.svelte";

    export let value = 0;

    const dispatch = createEventDispatcher<{ change: number }>();

    const progress = tweened(0, {
        duration: 100,
    });

    $: {
        $progress = value;
    }

    const handleTouch = (e: TouchEvent & { target: HTMLInputElement }) => {
        let left = bar.getBoundingClientRect().left;
        let start = e.touches[0].clientX - left;
        let width = bar.offsetWidth;
        let output = ~~Math.min(100, Math.max(0, (start / width) * 100));

        value = output;

        e.preventDefault();
        e.stopPropagation();

        dispatch("change", value);
    };

    let timeout = 0;

    let last = 0;

    let pressed = false;
    const handleMouse = (e: MouseEvent & { target: HTMLInputElement }) => {
        // e.button
        if (e.buttons & 1) {
            let left = bar.getBoundingClientRect().left;
            let start = e.clientX - left;
            let width = bar.offsetWidth;

            let output = ~~Math.min(100, Math.max(0, (start / width) * 100));

            value = output;

            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = window.setTimeout(() => {
                if (last != value) {
                    last = value;
                    dispatch("change", value);
                }
                timeout = 0;
            }, 1);
        }
    };

    let bar: HTMLElement;
</script>

<!--  -->

<main>
    <m-bar
        bind:this={bar}
        on:mousedown={handleMouse}
        on:mousemove={handleMouse}
        on:touchstart={handleTouch}
        on:touchmove={handleTouch}>
        <m-fill style="width: {$progress}%;" class:full={value >= 100} />
        <m-icon>
            <slot>
                {#if value > 70}
                    <IoIosVolumeHigh />
                {:else}
                    <IoIosVolumeLow />
                {/if}
            </slot>
        </m-icon>
        <m-icon class="end">
            <!-- <slot><IoIosVolumeHigh /></slot> -->
        </m-icon>
    </m-bar>
</main>

<style lang="scss">
    main {
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
        align-items: center !important;

        width: 100% !important;
    }

    m-bar {
        user-select: none !important;
        cursor: pointer !important;

        background: #ddd !important;
        position: relative !important;
        border-radius: 12px !important;
        height: 44px !important;
        width: 100% !important;
        box-shadow: 0 3px 12px rgba(95, 95, 95, 0.37) !important;
        overflow: hidden !important;

        &::after {
            content: "" !important;
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
            box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.37) !important;
        }
    }

    m-fill {
        left: 0 !important;
        height: 100% !important;
        background: #fff !important;
        position: absolute !important;
        pointer-events: none !important;
    }

    m-icon {
        position: absolute !important;
        height: 100% !important;
        padding: 6px !important;
        color: #777 !important;
        box-sizing: border-box !important;
        top: 0;
        left: 0;
        box-sizing: border-box;

        &.end {
            left: unset;
            right: 0;
        }
    }
</style>
