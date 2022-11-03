<script lang="ts" context="module">
    export interface IMenuItem {
        label: string;
        icon: string;
        id: any;
    }
</script>

<script lang="ts">
    export let item: IMenuItem;
</script>

<m-item on:click>
    <img src={item.icon} alt="" />
    <h2>{item.label}</h2>
</m-item>

<style lang="scss">
    m-item {
        width: 100%;
        display: flex;

        border-radius: 5px;

        padding: 12px;

        border-radius: 12px;
        background: linear-gradient(to bottom, #f7f7f7, #e7e7e7);

        box-sizing: border-box;

        &:active {
            background: #eee;
        }
    }

    img {
        height: 60px;
        width: 60px;
        object-fit: cover;
    }

    h2 {
        font-family: "Segoe UI";
        font-weight: lighter;
        font-size: 33px;
        padding-left: 12px;
    }
</style>
