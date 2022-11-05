import App from './Overlay.svelte'


function parseArgs(defaults = { port: 9111 }) {
    let args = defaults ?? {}
    for (let i = 0; i < process.argv.length; i++) {
        const element = process.argv[i];
        if (element == "-p" || element == "--port") {
            let p = Number.parseInt(process.argv[i + 1]);
            if (!isNaN(p)) {
                args.port = p;
            }
        }
    }
    return args;
}

let { port } = parseArgs();

console.log("yasiyorum", port, document, document.body)

let oldElm: any;

requestAnimationFrame(() => {

    console.log("yasiyorum frame", port, document, document.body)

    console.log('old elm', oldElm)

    let elm = document.body.appendChild(document.createElement("div"));
    attachOverlay(elm);

    oldElm = elm;
    console.log('new elm', elm)
})


window.onload = (e) => {

    //if (document.readyState == "interactive") {


    // }
}
// if (!root) {

//     alert("aaaaa buldum sanki ama?? ben bunu ya")
// } else {
//     alert("aaaaaaa bulamadim ben bunu ya")
//     root = document.body.appendChild(document.createElement("div"));
// }

function attachOverlay(root: HTMLElement) {

    //alert("buldum sanki ama?? ben bunu ya")
    function attach(elm: any) {
        let parent = elm || document.body
        if (root!.parentElement != parent) {
            parent.appendChild(root);
        }
    }

    document.addEventListener('fullscreenerror', () => {
        console.log('fs error ???? ');

    })
    document.addEventListener('fullscreenchange', () => {
        console.log('geliyor mu ne bee  ');
        if (document.fullscreenElement) {
            console.log('ahahaa', document.fullscreenElement, root);

        }
        else {
            console.log('olmamis sanki abi ya');
        }
        attach(document.fullscreenElement)
    })
    setInterval(() => {
        attach(document.fullscreenElement)
    }, 500)

    // root = document.body.appendChild(document.createElement('div'))
    //root.id = id
    //console.log('append eyleniyorum');

    //window.onload = () => {
    const app = new App({
        target: root!,
        props: {
            port: port
        }
    })
    //}


}








