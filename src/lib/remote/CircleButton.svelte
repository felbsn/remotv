<script lang="ts">
    export let icon: any | undefined = undefined;
    export let big = false;
</script>

<button on:click class:big>
    <m-content>
        {#if icon}
            <svelte:component this={icon} />
        {/if}
        <slot />
    </m-content>
</button>

<style lang="scss">
    m-content {
        display: flex;
        flex: 1 0 0;
        justify-content: center;
        align-items: center;
    }

    button {
        background-color: #f7f7f7;

        border: none;

        background-image: linear-gradient(to bottom, #f7f7f7, #e7e7e7);

        color: #a7a7a7;

        height: 32px;
        width: 32px;
        --margin: -6px;
        margin: 6px;

        &.big {
            height: 72px;
            width: 72px;

            --margin: -12px;
            margin: 12px;
        }

        // width: calc($size - $margin * 2);

        cursor: pointer;

        box-sizing: border-box;

        background-color: red;

        position: relative;
        text-align: center;
        border-radius: 50%;
        box-shadow: 0px 3px 8px #aaa, inset 0px 2px 3px #fff;

        display: flex;
        flex-shrink: 0;
        align-items: center;
    }

    button:before {
        content: "";
        display: block;
        background: #fff;
        border-top: 2px solid #ddd;
        position: absolute;

        top: var(--margin);
        bottom: var(--margin);
        left: var(--margin);
        right: var(--margin);

        // top: -$circle;
        // left: -$circle;
        // bottom: -$circle;
        // right: -$circle;

        z-index: -1;
        border-radius: 50%;
        box-shadow: inset 0px 8px 48px #ddd;
    }

    button:hover {
        text-decoration: none;
        color: #555;
        background: #f5f5f5;
    }

    button:active {
        text-decoration: none;
        color: #999;
        background: #e5e5e5;
        box-shadow: 0px 1px 4px #aaa, inset 0px 2px 1px #ddd;
    }
</style>
