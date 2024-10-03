// Constants
const supportedLinks = [
    "https?://twitter\\.com/.*/status/.*",
    "https?://.*\\.twitter\\.com/.*/status/.*",
    "https?://twitter\\.com/.*/moments/.*",
    "https?://.*\\.twitter\\.com/.*/moments/.*",
    "https?://x\\.com/.*/status/.*",
    "https?://.*\\.x\\.com/.*/status/.*",
    "https?://x\\.com/.*/status/.*",
    "https?://x\\.com/.*/moments/.*",
    "https?://.*\\.x\\.com/.*/moments/.*",
    "https?://.*\\.youtube\\.com/watch.*",
    "https?://.*\\.youtube\\.com/v/.*",
    "https?://youtu\\.be/.*",
    "https?://.*\\.youtube\\.com/playlist\\?list=.*",
    "https?://youtube\\.com/playlist\\?list=.*",
    "https?://.*\\.youtube\\.com/shorts/.*",
    "https?://youtube\\.com/shorts/.*",
    "https?://instagram\\.com/.*/p/.*,",
    "https?://www\\.instagram\\.com/.*/p/.*,",
    "https?://instagram\\.com/.*/p/.*,",
    "https?://www\\.instagram\\.com/.*/p/.*,",
    "https?://instagram\\.com/p/.*",
    "https?://instagr\\.am/p/.*",
    "https?://www\\.instagram\\.com/p/.*",
    "https?://www\\.instagr\\.am/p/.*",
    "https?://instagram\\.com/p/.*",
    "https?://instagr\\.am/p/.*",
    "https?://www\\.instagram\\.com/p/.*",
    "https?://www\\.instagr\\.am/p/.*",
    "https?://instagram\\.com/tv/.*",
    "https?://instagr\\.am/tv/.*",
    "https?://www\\.instagram\\.com/tv/.*",
    "https?://www\\.instagr\\.am/tv/.*",
    "https?://instagram\\.com/tv/.*",
    "https?://instagr\\.am/tv/.*",
    "https?://www\\.instagram\\.com/tv/.*",
    "https?://www\\.instagr\\.am/tv/.*",
    "https?://open\\.spotify\\.com/.*"
]

const iFrames = {
    "tweet": "<iframe height=600 width=500 border=0 frameborder=0 src='https://twitframe.com/show?url=TWEETURL'></iframe>",
    "youtube-video": '<iframe width="500" height="300" src="https://www.youtube.com/embed/VIDEOID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
    "youtube-short": '<iframe width="315" height="560" src="YTSHORTURL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;gyroscope; picture-in-picture;web-share;fullscreen"></iframe>',
    "youtube-playlist": '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLAYLISTID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>',
    "instagram-post": '<iframe src="https://www.instagram.com/p/IGPOSTID/embed" width="400" height="600" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media"></iframe>',
    "spotify-album-artist": '<iframe style="border-radius: 12px" width="100%" height="352" title="Spotify album" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" src="SPOTIFYURL"></iframe>',
    "spotify-track": '<iframe style="border-radius: 12px" width="100%" height="152" title="Spotify song" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" src="SPOTIFYURL"></iframe>'
}
// End Constants

// Vars
let linksParsed = {}
let lastLoaded = null
const config = { childList: true, subtree: true };
// End Vars

// Util functions
function isASupportedLink(link) {
    return supportedLinks.some(supportedLink => new RegExp(`^${supportedLink}$`).test(link));
}

const isTwitterLink = link => link.includes("x.com") || link.includes("twitter.com");

const isYoutubeShort = link => link.includes("youtube.com/shorts");

const isYoutubeVideo = link => link.includes("youtube.com/v") || link.includes("youtube.com/watch");

const isYoutubePlaylist = link => link.includes("youtube.com/playlist");

const isInstagramPost = link => link.includes("instagram.com/p/");

const isSpotifyAlbumOrArtist = link => link.includes("open.spotify") && !link.includes("track");

const isSpotifyTrack = link => link.includes("open.spotify") && link.includes("track");

function extractYouTubeVideoId(url) {
    const match = url.match(/(?:watch\?v=|v\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function extractInstagramPostId(url) {
    const match = url.match(/\/p\/([^\/?]+)/);
    return match ? match[1] : null;
}

function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
// End Util functions

// Process functions
function getEmbed(link) {
    if (link in linksParsed) {
        return linksParsed[link];
    }

    const hash = hashCode(link);
    let embed = {};

    if (isTwitterLink(link)) {
        link = link.replace("x.com", "twitter.com");
        embed.html = iFrames["tweet"].replace("TWEETURL", link);
    } else if (isYoutubeShort(link)) {
        link = link.replace("shorts", "embed");
        embed.html = iFrames["youtube-short"].replace("YTSHORTURL", link);
    } else if (isYoutubeVideo(link)) {
        const videoId = extractYouTubeVideoId(link);
        embed.html = iFrames["youtube-video"].replace("VIDEOID", videoId);
    } else if (isYoutubePlaylist(link)) {
        const playlistId = link.split("list=")[1].split("&")[0];
        embed.html = iFrames["youtube-playlist"].replace("PLAYLISTID", playlistId);
    } else if (isInstagramPost(link)) {
        const postId = extractInstagramPostId(link);
        if (postId) {
            embed.html = iFrames["instagram-post"].replace("IGPOSTID", postId);
        }
    } else if (isSpotifyTrack(link)) {
        link = link.replace("open.spotify.com/track/", "open.spotify.com/embed/track/");
        embed.html = iFrames["spotify-track"].replace("SPOTIFYURL", link);
    } else if (isSpotifyAlbumOrArtist(link)) {
        link = link.replace("open.spotify.com/", "open.spotify.com/embed/");
        embed.html = iFrames["spotify-album-artist"].replace("SPOTIFYURL", link);
    } 

    if (embed.html) {
        embed.html = `<div class="embedded-media-${hash}">${embed.html}</div>`;
    }

    linksParsed[link] = embed;
    return embed;
}

const processLink = async (target, link) => {
    const href = link.href;
    const hash = hashCode(href);
    const embeddedMedia = target.getElementsByClassName(`embedded-media-${hash}`);

    if (embeddedMedia.length === 0 && isASupportedLink(href) && link.children.length === 0) {
        const result = getEmbed(href);
        if (result.html) {
            if (link.parentElement) {
                link.parentElement.innerHTML += `<br />${result.html}`;
            } 
        }
    }
};

const processMessage = async (message) => {
    const links = message.getElementsByTagName("a")
    for (const link of links) {
        await processLink(message, link)
        setTimeout(() => { removeUrlPreview(message, link); }, "500");
    }
}
// End Process functions

// UI functions
const relocateNotifications = () => {
    const notifications = document.body.querySelector("[data-tid=app-layout-area--in-app-notifications]");
 
    if (notifications) {
        notifications.setAttribute(
            "style",
            "position: fixed; top: 112px; right: 0; max-height: 0px"
        );
    }
}

function removeUrlPreview(target, link) {
    const href = link.href;

    if (isASupportedLink(link.href)) {
        const elements = target.querySelectorAll(`[data-tid="url-preview"]`);
        elements.forEach(element => {
            const elementToRemove = element.closest("a");
            if (elementToRemove) {
                elementToRemove.parentElement.removeChild(elementToRemove);
            }
        });
    }
}

function sendReaction(reaction){
    document.getElementById("reaction-menu-button").click(); 
    document.querySelector("[data-tid=reactions-popup]").querySelector(`button[id="${reaction}"]`).click()
}
// End UI functions

// Main
let observedNodes = new Map();

function observeNode(node, callback) {
    if (!observedNodes.has(node)) {
        const observer = new MutationObserver(callback);
        observer.observe(node, { childList: true, subtree: true });
        observedNodes.set(node, observer);
    }
}

function handleMutations(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            handleNewNode(mutation);
        }
    }
}

const handleNewNode = async (event) => {
    const target = event.target;
    if (target.firstChild && 
        target.firstChild instanceof Element && 
        target.firstChild.getAttribute("data-tid") === "chat-pane-item"
    ) {
        await processMessage(target)
    }
}

// Main observer setup
const observerCallback = async function(mutationsList, observer) {
    relocateNotifications();

    const elements = {
        messagesList: document.body.querySelector('[data-tid="message-pane-list-runway"]'),
        postsList: document.body.querySelector('[data-tid="channel-pane-viewport"]'),
        repliesList: document.body.querySelector('[data-tid="channel-replies-viewport"]'),
        reactions: document.body.querySelector('[id="reaction-menu-button"]'),
        shortcut: document.body.querySelector('[id="reactions-shortcut"]')
    };

    const processList = async (list, selector) => {
        const items = list.querySelectorAll(selector);
        const itemsTexts = Array.from(items).map(item => item.id);
        const itemsHash = hashCode(itemsTexts.join('-'));
        
        if (itemsHash !== lastLoaded) {
            lastLoaded = itemsHash;
            for (const item of items) {
                await processMessage(item);
            }
            observeNode(list, handleMutations);
        }
    };

    switch (true) {
        case elements.messagesList !== null: // Chats
            await processList(elements.messagesList, '[data-tid="chat-pane-message"]');
            break;

        case elements.postsList !== null: // Posts (Teams channels)
            await processList(elements.postsList, '[data-tid="channel-pane-message"]');
            break;

        case elements.repliesList !== null: // Replies (In a post)
            await processList(elements.repliesList, '[data-tid="channel-replies-pane-message"]');
            break;

        case elements.reactions !== null && !elements.shortcut: // Reactions (In a call)
            elements.reactions.setAttribute("style", "visibility: hidden; position: absolute; left: -9999px;");
            elements.reactions.click();
            const reactionsButtons = document.querySelector("[data-tid=reactions-popup]").cloneNode(true);
            elements.reactions.click();
            const template = document.createElement('div');
            template.setAttribute('style', 'display: flex');
            template.setAttribute('id', 'reactions-shortcut');
            reactionsButtons.setAttribute('data-tid', 'reactions-popup-bt');
            template.appendChild(reactionsButtons);

            const buttons = template.querySelectorAll('button');
            buttons.forEach(button => {
                const reaction = button.getAttribute('id');
                button.onclick = () => sendReaction(reaction);
            });

            const parentElement = elements.reactions.parentElement;
            parentElement.insertBefore(template, parentElement.children[0]);

            break;

        default:
            // Nothing to do
            break;
    }
};

// Observe the document body for subtree modifications
observeNode(document.body, observerCallback);
