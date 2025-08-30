// Embed logic

import { hashCode, extractYouTubeVideoId, extractInstagramPostId } from './utils.js';

const iFrames = {
    tweet: "<iframe height=600 width=500 border=0 frameborder=0 src='https://twitframe.com/show?url=TWEETURL'></iframe>",
    'youtube-video': '<iframe width="500" height="300" src="https://www.youtube.com/embed/VIDEOID?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
    'youtube-short': '<iframe width="315" height="560" src="YTSHORTURL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;gyroscope; picture-in-picture;web-share;fullscreen"></iframe>',
    'youtube-playlist': '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLAYLISTID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>',
    'instagram-post': '<iframe src="https://www.instagram.com/p/IGPOSTID/embed" width="400" height="600" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media"></iframe>',
    'spotify-album-artist': '<iframe style="border-radius: 12px" width="100%" height="352" title="Spotify album" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" src="SPOTIFYURL"></iframe>',
    'spotify-track': '<iframe style="border-radius: 12px" width="100%" height="152" title="Spotify song" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" src="SPOTIFYURL"></iframe>'
};

const linksParsed = {};

function isTwitterLink(link) {
    return link.includes("x.com") || link.includes("twitter.com");
}
function isYoutubeShort(link) {
    return link.includes("youtube.com/shorts");
}
function isYoutubeVideo(link) {
    return link.includes("youtube.com/v") || link.includes("youtube.com/watch") || link.includes("youtu.be/");
}
function isYoutubePlaylist(link) {
    return link.includes("youtube.com/playlist");
}
function isInstagramPost(link) {
    return link.includes("instagram.com/p/");
}
function isSpotifyAlbumOrArtist(link) {
    return link.includes("open.spotify") && !link.includes("/track");
}
function isSpotifyTrack(link) {
    return link.includes("open.spotify") && link.includes("/track");
}

function getEmbed(link) {
    if (link in linksParsed) {
        return linksParsed[link];
    }
    const hash = hashCode(link);
    let embed = {};

    if (isTwitterLink(link)) {
        let elink = link.replace("x.com", "twitter.com");
        embed.html = iFrames["tweet"].replace("TWEETURL", elink);
    } else if (isYoutubeShort(link)) {
        let elink = link.replace("shorts", "embed");
        embed.html = iFrames["youtube-short"].replace("YTSHORTURL", elink);
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
        let elink = link.replace("/embed/", "/").replace("/track/", "/embed/track/");
        embed.html = iFrames["spotify-track"].replace("SPOTIFYURL", elink);
    } else if (isSpotifyAlbumOrArtist(link)) {
        let elink = link.replace("/embed/", "/").replace("/album/", "/embed/album/").replace("/artist/", "/embed/artist/");
        embed.html = iFrames["spotify-album-artist"].replace("SPOTIFYURL", elink);
    }

    if (embed.html) {
        embed.html = `<div class="embedded-media-${hash}">${embed.html}</div>`;
    }

    linksParsed[link] = embed;
    return embed;
}

export { getEmbed };
