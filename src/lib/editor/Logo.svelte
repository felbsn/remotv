<script lang="ts">
    export let url: string;

    export let big = false;
</script>

<m-logo class:big>
    <img
        src={url}
        alt=""
        on:error={() => {
            url = "/favicon.png";
        }} />
</m-logo>

<style lang="scss">
    m-logo {
        display: flex;
        flex-shrink: 0;
        overflow: hidden;
        width: 42px;
        height: 42px;
        margin: 6px;

        // filter: drop-shadow(0 0 2px #4444);

        //border-radius: 50%;
        //box-shadow: 0 0 12px #4444;

        background: transparent;

        &.big {
            width: 84px;
            height: 84px;

            // background: linear-gradient(to bottom, rgb(241, 241, 241), rgb(122, 122, 122));
            //box-shadow: 0 2px 12px #4448;

            img {
                padding: 6px;
                //border-radius: inherit;
            }

            &:hover {
                //box-shadow: 0 1px 6px #4444;
                filter: brightness(1.1);
            }
        }
    }

    img {
        display: flex;
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        // background-color: whitesmoke;
        // border-radius: 50%;
        box-sizing: border-box;
    }
</style>
