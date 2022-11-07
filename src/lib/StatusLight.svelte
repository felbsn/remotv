<script lang="ts">
    export let state: "ok" | "warn" | "err" = "ok";
</script>

<m-status-light class={state}>
    <m-inner-light class={state} />
</m-status-light>

<style lang="scss">
    m-status-light {
        display: grid;
        place-items: center;

        position: fixed;
        bottom: 6px;
        left: 6px;
        z-index: 999;

        m-inner-light {
            display: block;
            width: 20px;
            height: 20px;

            &.ok {
                background-color: rgb(0, 255, 34);
            }
            &.warn {
                background-color: rgb(255, 238, 0);
            }
            &.err {
                background-color: rgb(255, 72, 0);
            }

            border-radius: 50%;
            box-shadow: 0 0 12px #444a;
        }
    }
</style>
