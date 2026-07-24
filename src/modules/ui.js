// UI manipulation functions
function relocateNotifications() {
    const notifications = document.body.querySelector("[data-tid=app-layout-area--in-app-notifications]");
    if (notifications) {
        notifications.setAttribute(
            "style",
            "position: fixed; top: 112px; right: 0; max-height: 0px"
        );
    }
}

function sendReaction(reaction){
    const menuButton = document.getElementById("reaction-menu-button");
    if (!menuButton) return;

    const observer = new MutationObserver((_, obs) => {
        const toolbox = document.querySelector("[data-tid=reaction-menu-button-toolbox]");
        if (!toolbox) return;

        const reactionButton = toolbox.querySelector(`button[id="${reaction}"]`);
        if (!reactionButton) return;

        obs.disconnect();
        toolbox.setAttribute("style", "opacity: 0; position: absolute; left: -9999px;");
        reactionButton.click();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    menuButton.click();
}

export { relocateNotifications, sendReaction };
