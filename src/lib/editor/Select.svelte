<script lang="ts">
    export let options: { label: string; value: any }[] = [];
    export let value: string | null | undefined;
    export let fill = false;
</script>

<m-input-base class:fill>
    <select on:click {...$$props} bind:value on:change>
        {#each options as opt}
            <option value={opt.value}>{opt.label}</option>
        {/each}
    </select>
</m-input-base>

<style lang="scss">
    m-input-base {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        min-width: 120px;
        flex: 1 0 0;

        &.fill {
            max-width: unset;
        }
    }

    option {
    }

    select {
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
