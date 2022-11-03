

export function longPress(node: HTMLElement, pressing: () => void) {
    let interval = 0;

    function pressDown() {
        if (interval)
            clearInterval(interval)
        interval = window.setInterval(() => {
            pressing();
        }, 100)
    }
    function pressUp() {
        if (interval)
            clearInterval(interval)
    }

    node.addEventListener("pointerdown", pressDown)
    node.addEventListener("pointerout", pressUp)
    node.addEventListener("pointerup", pressUp)

    return {
        destroy() {
            node.removeEventListener("pointerdown", pressDown)
            node.removeEventListener("pointerout", pressUp)
            node.removeEventListener("pointerup", pressUp)
        }
    }
}