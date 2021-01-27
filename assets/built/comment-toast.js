function generateCommentsData(json) {

    // Poor configuration settings, develop them yourself!
    var config = {
        containerID: 'result-container', // Container ID to show the generated data
        avatarSize: 72, // Default avatar size
        text: {
            anon: 'Anonymous'
        }
    };

    var html = "",
        item = "",
        w = window,
        d = document,
        feed = json.feed,
        container = d.getElementById(config.containerID),
        postCommentTotal = +feed.openSearch$totalResults.$t, // The comment feeds' total (all)
        postCommentStartIndex = +feed.openSearch$startIndex.$t, // The comment feeds' start index
        postCommentPerPage = +feed.openSearch$itemsPerPage.$t, // The comment feeds' max results per page or per feed request
        blogID = /\:blog-?(\d+)(\.|$)/.exec(feed.id.$t) ? /\:blog-?(\d+)(\.|$)/.exec(feed.id.$t)[1] : false, // The blog ID
        postID = /\.post-?(\d+)(\.|$)/.exec(feed.id.$t) ? /\.post-?(\d+)(\.|$)/.exec(feed.id.$t)[1] : false, // The current post ID (if any)
        postURL = false, // The current post URL (if any)
        blogTitle = feed.title.$t, // The comment feeds' title
        blogAuthorName = feed.author[0].name ? feed.author[0].name.$t : config.text.anon, // The blog/post author name
        blogAuthorAvatar = feed.author[0].gd$image.src.replace(/\/s\d+(\-c)?\//, '/s' + config.avatarSize + '-c/'), // The blog/post author profile avatar URL
        blogGeneratorName = feed.generator.$t, // The blog generator name (Blogger)
        blogGeneratorURL = feed.generator.uri; // The blog generator URL (http://www.blogger.com)
    blogAuthorAvatar = blogAuthorAvatar.replace(/^https?\:/, ""); // Remove the leading `http://` or `https://` in blog/post author profile avatar URL

    // No container found
    if (!container) {
        alert('Container not found.');
        return;
    }

    // Getting the current post URL (if any)
    if (postID) {
        for (var h = 0, hen = feed.link.length; h < hen; ++h) {
            item = feed.link[h];
            if (item.rel == 'alternate') {
                postURL = item.href;
                break;
            }
        }
    }

    // No comments yet
    if (!feed.entry || feed.entry.length === 0) {
        container.innerHTML = '<p>No comments yet.</p>';
        return;
    }

    // Building the markup ...
    html += '<section>';

    var comments = feed.entry;

    for (var i = 0, ien = comments.length; i < ien; ++i) {

        var comment = comments[i], // A single comment feed object
            commentID = comment.id.$t, // The comment ID
            commentPublish = comment.published.$t, // The comment publishing time in ISO format
            commentUpdate = comment.updated.$t, // The comment updating time in ISO format
            commentDate = commentPublish, // The comment publishing time in timestamp format you defined in the dashboard
            commentAuthorName = comment.author[0].name ? comment.author[0].name.$t : config.text.anon, // The comment author name
            commentAuthorURL = comment.author[0].uri ? comment.author[0].uri.$t : false, // The comment author profile URL
            commentAuthorAvatar = comment.author[0].gd$image.src.replace(/\/s\d+(\-c)?\//, '/s' + config.avatarSize + '-c/'), // The comment author profile avatar URL
            commentContent = comment.summary.$t.includes('<a href="http://')  || comment.summary.$t.includes('<a href="https://') || comment.summary.$t.includes('<a href="//') ? comment.summary.$t.replace(/<br *\/?>|[\s]+/gi, ' ').replace(/<.*?>|[<>]/g, "") : comment.summary.$t, // The comment content
            commentParent = false, // The comment parent ID (if any, for child comments)
            commentPermalink = false, // The comment permalink
            commentIsAdmin = commentAuthorName === blogAuthorName || commentAuthorAvatar === blogAuthorAvatar, // Is this comment was created by the blog/post author?
            commentDeleteURL = false; // The comment delete URL
        commentAuthorAvatar = commentAuthorAvatar.replace(/^https?\:/, ""); // Remove the leading `http://` or `https://` in comment author profile avatar URL
        commentAuthorAvatar = commentAuthorAvatar.replace(/\/\/img1.blogblog.com\/img\/blank.gif/, "//lh3.googleusercontent.com/a/default-user=w72");
        commentAuthorAvatar = commentAuthorAvatar.replace(/[1234].bp.blogspot.com/, "lh3.googleusercontent.com");

        for (var j = 0, jen = comment.link.length; j < jen; ++j) {
            item = comment.link[j];
            if (item.rel == 'self') {
                // Getting the original comment ID
                commentID = item.href.split('/').pop();
                // Getting the comment delete URL
                commentDeleteURL = item.href.replace(/https:\/\/www.blogger.com\/feeds\/(\d+)\/(\d+)\/comments?\/(default|summary)\/(\d+)/, '/p/delete.html?blogID=$1&postID=$4');
                commentInReplyToURL = item.href.replace(/https:\/\/www.blogger.com\/feeds\/(\d+)\/(\d+)\/comments?\/(default|summary)\/(\d+)/, '/p/inreplyto.html?blogID=$1&postID=$2&parentID=$4');
            }


            // Getting the comment permalink URL
            if (item.rel == 'alternate') {
                commentPermalink = item.href;
                pstName = commentPermalink.split('/').pop();
                titleNames = pstName.replace(/^[\/0-9]+|\.[^\.]+$/g, '').replace(/[_\/-]/g, ' ');
                fixTitle = titleNames.charAt(0).toUpperCase() + titleNames.substr(1).toLowerCase() + "…";

            }
            // Getting the comment parent ID (if any)
            if (item.rel == 'related') {
                var parentID = item.href.split('/').pop();
                commentParent = commentID !== parentID ? parentID : false;
            }
        }

        // Getting the comment publishing time in timestamp format you defined in the dashboard
        for (var k = 0, ken = comment.gd$extendedProperty.length; k < ken; ++k) {
            item = comment.gd$extendedProperty[k];
            if (item.name == 'blogger.displayTime') {
                commentDate = item.value;
                break;
            }
        }

        // Building the markup ...
        html += '<article id="' + commentID + '">';
        html += '<img src="' + commentAuthorAvatar + '"/>';
        html += '<header><h6><strong>' + commentAuthorName + '</strong> berkomentar pada postingan <a href="' + commentPermalink + '">”<em>' + fixTitle + '</em>”</a></h6></header>';
        html += '<div>' + commentContent + '</div>';
        html += '<footer>';
        html += '<p><small><em>' + commentDate + '</em></small></p>';
        html += '<p><a href="' + commentDeleteURL + '" target="_blank">Hapus</a> <a href="' + commentInReplyToURL + '" target="_blank" onclick="window.open(this.href,&#39;_cf&#39;,&#39;scrollbars=1,width=470,height=250,left=355,top=135&#39;);return false;">Balas</a></p>';
        html += '</footer>';
        html += '<hr>'
        html += '</article>';

    }

    // Building the markup ...
    html += '</section>';

    // Show the generated data to the container ...
    container.innerHTML = html;

}