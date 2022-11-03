import App from './Overlay.svelte'

console.log("yasiyorum")

const id = "oylebirseylerkaraladimiste";

let root = document.getElementById(id);
// if (!root) {

//     alert("aaaaa buldum sanki ama?? ben bunu ya")
// } else {
//     alert("aaaaaaa bulamadim ben bunu ya")
//     root = document.body.appendChild(document.createElement("div"));
// }

if (root != null) {

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

    root = document.body.appendChild(document.createElement('div'))
    root.id = id
    console.log('append eyleniyorum');

    const app = new App({
        target: root
    })
}







