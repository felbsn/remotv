<script lang="ts">
    import type { ICommand } from "$scripts/models/ICommand";
    import { Ace, edit } from "ace-builds";
    import { onMount } from "svelte";
    import api from "$scripts/api";
    import "ace-builds/src-noconflict/ext-language_tools";
    import "ace-builds/src-noconflict/mode-javascript";
    import imageCompression from "browser-image-compression";
    import MdAdd from "svelte-icons/md/MdAdd.svelte";

    let channels: (ICommand & { new?: boolean })[] = [];

    let text = "";
    let node: HTMLElement;

    let url = "https://google.com";
    let script = "";
    let title = "title";
    let id = Math.random().toString();

    let files: FileList;

    let icon = "";

    let editor: Ace.Editor;
    //$: icon = files && files.length > 0 ? URL.createObjectURL(files.item(0)!) : "";

    async function runCommand() {
        await api.runCommand({
            id,
            icon,
            scripts: script ? [script] : [],
            title,
            url,
        });
    }

    async function saveCommand() {
        await api.updateCommand({
            id,
            icon,
            scripts: script ? [script] : [],
            title,
            url,
        });
    }

    async function deleteCommand() {
        await api.deleteCommand({ id });
    }

    async function handleImageUpload(event: any) {
        console.log("oluyor mu boyle yaa");
        const imageFile = event.target.files[0];
        console.log("what are the iamges", imageFile);

        console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        try {
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 256,
            });
            console.log("compressedFile instanceof Blob", compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

            let result = await toBase64(compressedFile);
            icon = result;
        } catch (error) {
            console.log(error);
        }
    }

    onMount(async () => {
        editor = edit(node, {
            //@ts-ignore
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            fontSize: 18,
        });

        editor.session.setMode("ace/mode/javascript");

        var staticWordCompleter = {
            getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: any) {
                var wordList = ["delay(duration:number)", "click(selector:string)", "hide(selector:string)"];
                callback(
                    null,
                    wordList.map(function (word) {
                        return {
                            caption: word,
                            value: word.split("(")[0] + "(",
                            meta: "function",
                        };
                    })
                );
            },
        };

        editor.completers.push(staticWordCompleter);
        editor.on("change", (c) => {
            script = editor.getValue();
        });

        let res = await api.getCommandList();
        console.warn("commands res ", res);

        if (res.data) {
            channels = [
                ...res.data,
                {
                    id: Math.random().toString(),
                    icon: "/plus-blue.png",
                    scripts: [],
                    title: "Add New",
                    new: true,
                    url: "",
                },
            ];
        }
    });

    function toBase64(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    function selectCommand(cmd: ICommand) {
        id = cmd.id;
        icon = cmd.icon;
        script = cmd.scripts[0];
        editor.setValue(script);
        editor.clearSelection();
        title = cmd.title;
        url = cmd.url ?? "";
    }
</script>

<m-container>
    <m-side>
        {#each channels as channel}
            <m-channel class:selected={channel.id == id} on:click={() => selectCommand(channel)}>
                <img class="icon" src={channel.icon} alt="" />
                <m-title>
                    {channel.title}
                </m-title>
            </m-channel>
        {/each}
    </m-side>

    <m-editing>
        <input type="text" bind:value={id} />

        <m-row>
            <label class="icon">
                <input type="file" bind:files alt="n" accept="image/*" on:change={handleImageUpload} />
                <img src={icon} alt="" />
            </label>

            <input type="text" bind:value={title} style="width: 100%" />
        </m-row>

        <input type="text" bind:value={url} />
        <!-- <textarea name="" id="" cols="30" rows="10" bind:value={script} /> -->
        <m-editor bind:this={node} />

        <button on:click={runCommand}>run</button>
        <button on:click={saveCommand}>save</button>
        <button on:click={deleteCommand}>delete</button>

        <span>{script}</span>
    </m-editing>
</m-container>

<style lang="scss">
    :global(body, html) {
        width: 100%;
        height: 100%;
        display: flex;
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    m-container {
        display: flex;
        flex-direction: row;
        background-color: whitesmoke;
        flex: 1 0 0;
    }

    m-row {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }

    m-side {
        width: 120px;
        overflow: hidden;
        overflow-y: auto;

        padding: 6px;

        display: flex;
        flex-direction: column;

        background-color: #3166b5;

        gap: 6px;

        m-channel {
            background-color: white;

            display: flex;
            flex-direction: row;
            align-items: center;

            cursor: pointer;

            border-radius: 24px;
            box-shadow: 0 0 12px #4444;

            gap: 6px;

            &.selected {
                background-color: aqua;
                //background-color: rgb(158, 197, 255);
            }

            m-title {
            }

            img.icon {
                display: flex;
                width: 44px;
                height: 44px;
                // padding: 2px;

                // border: 2px solid black;
                box-shadow: 0 0 2px black;

                object-fit: fill;
                margin: 2px;

                overflow: hidden;
                border-radius: 50%;
                box-sizing: border-box;
            }
        }
    }

    label.icon {
        display: flex;
        flex: auto 0 0;
        height: 32px;
        width: 32px;
        overflow: hidden;

        position: relative;

        cursor: pointer;

        border-radius: 50%;
        box-shadow: 0 0 6px #4444;

        img {
            pointer-events: none;
        }
        input {
            display: none;
            // display: flex;
            // flex: 1 0 0;
            // position: absolute;
            // top: 0;

            // all: unset;
            // width: 100%;
            // height: 100%;
        }
    }

    m-editor {
        height: 300px;
        overflow: auto;

        //width: 300px;

        top: 0;
        left: 0;
        //position: absolute;

        box-shadow: 0 0 12px #4444;
        border-radius: 4px;
    }

    m-editing {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1 0 0;
        padding: 6px;
    }
</style>
