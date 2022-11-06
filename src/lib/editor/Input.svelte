<script lang="ts">
    export let value: string | undefined;
    export let label = "";

    export let placeHolder = "";
</script>

<m-input-base>
    {#if label}
        <m-label>{label}</m-label>
    {/if}
    <input type="text" placeholder={placeHolder} bind:value on:keydown on:keypress on:change />
</m-input-base>

<style lang="scss">
    m-input-base {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        min-width: 120px;
        flex: 1 0 0;
    }

    m-label {
        display: flex;
        padding: 3px;
    }

    input {
        background-color: whitesmoke;
        border-radius: 6px;
        padding: 6px;
        color: #444;
        box-shadow: 0 0 6px #4442;
        transition: all 200ms;

        width: 100%;
        box-sizing: border-box;

        outline: none;
        border: none;

        display: flex;
        flex: 1 0 0;

        &:focus {
            box-shadow: 0 1px 6px #0004;
        }
    }
</style>
