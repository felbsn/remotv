<script lang="ts" context="module">
    import { AxiosError } from "axios";

    interface IToast {
        title: string;
        content: string;
        type?: "info" | "warn" | "error" | "success";
        duration?: number;

        timer?: number;

        begin?: number;
        percent?: number;
    }

    const DEFAULT_DURATION = 6_000;

    export let fn: (arg0: IToast) => string;

    export function getError(content: string | any) {
        if (content instanceof AxiosError) {
            let err = content;
            content = err.response?.data ?? err.message;
        }
        return content;
    }

    export const toast = {
        info(content: string | any, title = "Info") {
            content = getError(content);

            return fn({
                title,
                content,
                duration: DEFAULT_DURATION,
                type: "info",
            });
        },
        error(content: string | any, title = "Error") {
            content = getError(content);
            console.error("error:", content);

            return fn({
                title,
                content,
                duration: DEFAULT_DURATION,
                type: "error",
            });
        },
        success(content: string | any, title = "Success") {
            content = getError(content);

            return fn({
                title,
                content,
                duration: DEFAULT_DURATION,
                type: "success",
            });
        },
        warn(content: string | any, title = "Warning") {
            content = getError(content);

            return fn({
                title,
                content,
                duration: DEFAULT_DURATION,
                type: "warn",
            });
        },
    };
</script>

<script lang="ts">
    import { onMount, tick } from "svelte";

    import { flip } from "svelte/animate";
    import { get, writable } from "svelte/store";
    import { fade, fly, scale, slide } from "svelte/transition";
    let toasts: IToast[] = [];

    export function add(t: IToast) {
        t.begin = Date.now();
        toasts = [...toasts, t];

        //await tick();

        t.timer = window.setTimeout(() => {
            let i = toasts.indexOf(t);
            toasts.splice(i, 1);
            toasts = toasts;
        }, t.duration);

        handlePercent();

        tick().then(() => {
            t.percent = 0;
            toasts = toasts;
        });

        return t.content;
    }
    fn = add;
    onMount(() => {
        fn = add;
    });

    let percentTimer: number;
    function handlePercent() {
        // if (!percentTimer) {
        //     percentTimer = window.setInterval(() => {
        //         if (toasts.length == 0) {
        //             clearInterval(percentTimer);
        //             percentTimer = 0;
        //         } else {
        //             for (const t of toasts.filter((d) => d.timer)) {
        //                 t.remaining = t.remaining ?? t.timeout;
        //                 t.remaining! -= 300;
        //                 t.percent = (t.remaining! * 100) / t.timeout!;
        //                 console.log(`what percent is t  ${t.percent}`, t);
        //                 t.percent = t.percent;
        //                 toasts = toasts;
        //                 // console.log("nedir t.percent ", t.percent);
        //                 // t.percent = (t.percent ?? 100) - 5;
        //             }
        //         }
        //     }, 300);
        // }
    }
</script>

<m-toasts>
    {#each toasts as toast (toast)}
        <m-toast
            animate:flip
            transition:fade
            class={toast.type}
            on:pointerleave={() => {
                toast.duration = toast.duration ? toast.duration : 6_000;
                toast.begin = Date.now();

                toast.timer = window.setTimeout(() => {
                    let i = toasts.indexOf(toast);
                    toasts.splice(i, 1);

                    toasts = toasts;
                }, toast.duration);

                toast.percent = 0;
                toasts = toasts;
            }}
            on:pointerenter={() => {
                if (toast.timer) {
                    window.clearTimeout(toast.timer);
                    toast.timer = 0;

                    toast.percent = 100;

                    //@ts-ignore
                    //  let percent = 100 - ((Date.now() - toast.begin) * 100) / toast.duration;
                    //  toast.percent = percent;

                    //  console.log("on hover percent is ", toast.percent);

                    //let percent = Date.now() - toast.begin!;

                    toasts = toasts;
                }
            }}>
            <m-title>{toast.title}</m-title>
            <m-content>{toast.content}</m-content>
            <m-line style="width:{toast.percent}%;transition:all {toast.duration}ms linear" />
        </m-toast>
    {/each}
</m-toasts>

<style lang="scss">
    m-toasts {
        display: flex;
        position: fixed;
        flex-direction: column;
        right: 12px;
        top: 64px;
        // height: 300px;
        width: 300px;

        z-index: 999;

        // background-color: red;

        m-toast {
            display: flex;
            flex-direction: column;
            background-color: rgba(0, 255, 89, 0.567);
            width: 300px;
            min-height: 72px;
            border-radius: 8px;
            margin: 3px;
            overflow: hidden;
            box-shadow: 0 3px 12px #0007;

            position: relative;

            backdrop-filter: blur(16px);

            opacity: 0.9;

            &:hover {
            }

            &.warn {
                background-color: rgba(255, 234, 0, 0.4);
            }

            &.info {
                background-color: rgba(105, 105, 105, 0.4);
            }

            &.error {
                background-color: rgba(255, 60, 0, 0.988);
                color: whitesmoke;
            }

            m-title {
                background-color: rgba(0, 0, 0, 0.1);
                font-weight: bolder;
                width: 100%;
                padding: 8px;
            }
            m-content {
                padding: 8px;
                display: flex;
                padding-bottom: 12px;
            }

            m-line {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                display: flex;
                height: 6px;
                background-color: rgba(232, 250, 254, 0);
                transition: all 300ms;
                // border-radius: inherit;
            }

            &:hover {
                m-line {
                    transition: all 100ms !important;
                }
            }
        }
    }
</style>
