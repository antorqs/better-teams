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
    document.getElementById("reaction-menu-button").click(); 
    document.querySelector("[data-tid=reactions-popup]").querySelector(`button[id="${reaction}"]`).click()
}

export { relocateNotifications, sendReaction };
