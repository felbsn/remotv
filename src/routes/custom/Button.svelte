<script lang="ts">
    export let danger = false;
</script>

<button on:click {...$$props} class:danger>
    <slot />
</button>

<style lang="scss">
    button {
        background-color: whitesmoke;
        border-radius: 6px;
        padding: 6px;
        color: #444;
        box-shadow: 0 0 6px #4444;

        min-width: 60px;

        outline: none;
        border: none;

        transition: all 200ms;
        cursor: pointer;

        &.danger {
            background-color: rgb(233, 23, 23);
            color: whitesmoke;
        }

        &:hover {
            box-shadow: 0 0 9px #4442;
            filter: brightness(1.1);
            //background-color: white;
        }

        &:active {
            box-shadow: 0 0 4px #4446;
            //background-color: rgb(238, 238, 238);
            filter: brightness(0.9);
        }
    }
</style>
