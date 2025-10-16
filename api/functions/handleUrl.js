/* This function take a post type and deternmines what the url that should be stored in the database*/
export default function handleUrl(type, url) {
    const checkUrl = {
        revisedUrl: url,
        error: null
    }

    if (type === "Text") {
        checkUrl.revisedUrl = null
        return checkUrl;
    }
    if (type === "Image") return checkUrl;
    if (type === "YouTube") {
        const startSting = "https://www.youtube.com/watch?v=";
        const startSting2 = "https://youtu.be/";
        const attachString = "https://www.youtube.com/embed/";
        if (url.startsWith(startSting, 0)) {
          const vidId = url.substr(32, 11);
          checkUrl.revisedUrl = attachString + vidId;
          return checkUrl;
        } else if (url.startsWith(startSting2, 0)) {
          const vidId = url.substr(17, 11);
          checkUrl.revisedUrl = attachString + vidId;
          return checkUrl;
        } else {
            checkUrl.error = "Youtube URL Is Invalid Or Formated Wrong";
            return checkUrl;
        }
      }
}