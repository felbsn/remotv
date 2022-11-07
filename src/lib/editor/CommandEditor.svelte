<script lang="ts">
    import type { ICommand } from "$scripts/models/ICommand";
    import { Ace, edit } from "ace-builds";
    import { createEventDispatcher, onMount } from "svelte";
    import api from "$scripts/api";
    import "ace-builds/src-noconflict/ext-language_tools";
    import "ace-builds/src-noconflict/mode-javascript";
    import imageCompression from "browser-image-compression";
    import Logo from "./Logo.svelte";
    import Input from "./Input.svelte";
    import Button from "./Button.svelte";
    import Blocks from "./Blocks.svelte";
    import { updated } from "$app/stores";
    import Select from "$lib/editor/Select.svelte";

    const dispatch = createEventDispatcher<{
        updated: boolean;
        delete: ICommand;
    }>();

    export let cmd: ICommand & { new?: true };

    // editor
    let node: HTMLElement;
    let editor: Ace.Editor;

    // upload
    let files: FileList;

    //current

    async function runCommand() {
        await api.runCommand(cmd);
    }
    async function saveCommand() {
        delete cmd.new;
        let res = await api.updateCommand(cmd);
        console.log("save result is", res);

        dispatch("updated");
    }
    async function deleteCommand() {
        dispatch("delete", cmd);
        if (!cmd.new) {
            await api.deleteCommand({ id: cmd.id });
        }
    }

    async function handleImageUpload(event: any) {
        const imageFile = files ? files.item(0) : null;
        if (imageFile == null) return;

        console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        try {
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 128,
            });
            console.log("compressedFile instanceof Blob", compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

            let result = await toBase64(compressedFile);
            cmd.icon = result;

            dispatch("updated");
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
            cmd.script = editor.getValue();
        });

        if (cmd) {
            //editor.setValue(cmd?.script ?? "");
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

    //fix for value thing...
    let cached = "-1";
    $: {
        updateScript(cmd);
    }
    function updateScript(c: ICommand) {
        if (cached != c.id) {
            cached = c.id;
            if (editor) {
                if (cmd.script) {
                    editor.setValue(cmd.script);
                } else editor.setValue("//todo: some script?");
            }
            upImg = cmd.icon?.startsWith("data") ? "" : cmd.icon;
        }
    }

    let upImg = "";
    let delayStr = "";
</script>

<m-card>
    <m-row>
        <Button on:click={runCommand}>run</Button>
        <Button on:click={saveCommand}>save</Button>
        <Button on:click={deleteCommand} danger>delete</Button>
    </m-row>
    <input type="text" bind:value={cmd.id} readonly disabled style="display: none;" />

    <m-row>
        <label class="icon">
            <input type="file" bind:files alt="n" accept="image/*" on:change={handleImageUpload} />
            <Logo bind:url={cmd.icon} big />
        </label>

        <m-col>
            <Input placeHolder="title" bind:value={cmd.title} on:change={() => dispatch("updated")} />
            <Input placeHolder="url" bind:value={cmd.url} />

            <Input
                placeHolder="image-url"
                bind:value={upImg}
                on:change={(e) => {
                    cmd.icon = upImg;
                    dispatch("updated");
                    // cmd.icon = e.detail
                }} />

            <!-- <Input bind:value={upImg} /> -->
        </m-col>
    </m-row>

    <Input
        placeHolder="delay as milliseconds"
        bind:value={delayStr}
        on:change={(e) => {
            let num = Number.parseInt(delayStr);
            cmd.delay = isNaN(num) ? 0 : cmd.delay;
        }} />

    <Select
        bind:value={cmd.suspendBlocking}
        options={[
            { label: "Session", value: "session" },
            { label: "Inject", value: "inject" },
            { label: "None", value: undefined },
        ]} />

    <Blocks bind:cmd />

    <m-editor bind:this={node} />
</m-card>

<style lang="scss">
    m-editor {
        display: flex;
        height: 300px;
        border-radius: 6px;
        box-shadow: 0 0 6px #4444;
    }

    m-row {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
        width: 100%;
    }
    m-col {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1 0 0;
    }

    m-card {
        display: flex;
        flex-direction: column;
        gap: 12px;

        box-sizing: border-box;

        background-color: #e1e8f0;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 0 12px #4444;

        width: clamp(320px, 80%, 1200px);

        height: min-content;
    }

    label.icon {
        display: flex;
        flex-direction: column;

        align-items: center;
        cursor: pointer;

        input {
            display: none;
        }
    }
</style>
