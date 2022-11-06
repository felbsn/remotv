(async () => {
    console.warn("%%%%%%%%%%%%%%%%%% injecting script");

    try {
        async function find(selector, tries = 20) {
            let found = document.querySelector(selector);
            let count = 1;
            while (!found) {
                if (count > tries)
                    break;

                count++;
                found = await new Promise(r => setTimeout(() => {
                    r(document.querySelector(selector))
                }, 200));
            };
            return found;
        };

        async function click(selector, tries = 6) {
            let found = await find(selector, tries);
            found?.click();
        };

        function delay(duration) {
            return new Promise((r) => setTimeout(r, duration));
        };
        function hide(selector) {
            let found = document.querySelector(selector);
            if (found) {
                found.style.display = "none";
            }
        };

        console.log('%%%%%%%%%%%%%%%%%%% executing scripts');

        //%script%

    } catch (error) {
        console.error("%%%%%%%%%%%%%%%%%%%%%%% error on executing script", error);
    }

    console.warn("%%%%%%%%%%%%%%%%%% done");
    // r(true);
})()