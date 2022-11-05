<script lang="ts">
    export let icon: any | undefined = undefined;
</script>

<button on:click>
    <m-content>
        {#if icon}
            <svelte:component this={icon} />
        {/if}
        <slot />
    </m-content>
</button>

<style lang="scss">
    $circle: 12px;
    $margin: 12px;
    $size: 96px;

    m-content {
        padding: 12px;
        display: flex;
    }

    button {
        background-color: #f7f7f7;

        border: none;

        background-image: linear-gradient(to bottom, #f7f7f7, #e7e7e7);

        color: #a7a7a7;
        margin: $margin;
        width: 144px;

        height: min-content;

        width: calc($size - $margin * 2);

        position: relative;
        text-align: center;
        border-radius: 50%;
        box-shadow: 0px 3px 8px #aaa, inset 0px 2px 3px #fff;

        display: flex;
        flex-shrink: 0;
    }

    button:before {
        content: "";
        display: block;
        background: #fff;
        border-top: 2px solid #ddd;
        position: absolute;
        top: -18px;
        left: -18px;
        bottom: -18px;
        right: -18px;

        top: -$circle;
        left: -$circle;
        bottom: -$circle;
        right: -$circle;

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
