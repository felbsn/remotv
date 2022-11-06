new Promise(async (r) => {
    try {
        function click(selector) {
            let found = document.querySelector(selector);
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

        //%script%

    } catch (error) {
        console.error("error on executing script", error);
    }
    r(true);
});