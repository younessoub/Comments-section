const mainContainer = document.querySelector('.main-container');


const commentContainer = (comment) => {

    return `
        <div class="comment-container">
            <div class="voting desktop">
                <div class="upvote" id=${comment.id}>
                    <img src="./images/icon-plus.svg" alt="upvote icon">
                </div>
                <div class="votes">
                    <span>${comment.score}</span>
                </div>
                <div class="downvote" id=${comment.id}>
                    <img src="./images/icon-minus.svg" alt="downvote icon">
                </div>
            </div>
            <div>
                <div class="comment-head">
                    <div class="info">
                        <div class="flex-center avatar">
                            <img src=${comment.user.image.webp} alt="avatar">
                        </div>
                        <b class="author-name">
                            ${comment.user.username}
                        </b>
                        <span class="time">
                            ${comment.createdAt}
                        </span>
                    </div>
                    <div class="reply-button desktop" id=${comment.id}>
                        <div class="flex-center">
                            <img src="./images/icon-reply.svg" alt="reply icon">
                        </div>
                        <span>Reply</span>
                    </div>
                </div>
                <div class="comment">
                    <p>
                        <span class='replying-to'>${comment.replyingTo ? '@' + comment.replyingTo : ''}</span> ${comment.content}
                    </p>
                </div>
                <div class="buttons mobile">
                    <div class="voting">
                        <div class="upvote" id=${comment.id}>
                            <img src="./images/icon-plus.svg" alt="upvote icon">
                        </div>
                        <div class="votes">
                            <span>${comment.score}</span>
                        </div>
                        <div class="downvote" id=${comment.id}>
                            <img src="./images/icon-minus.svg" alt="downvote icon">
                        </div>
                    </div>
                    <div class="reply-button" id=${comment.id}>
                        <div class="flex-center">
                            <img src="./images/icon-reply.svg" alt="reply icon">
                        </div>
                        <span>Reply</span>
                    </div>
                </div>
            </div>
        </div>
    `
}

const replyContainer = (currentUser, comment) => {
    return `
        <div class="reply-container" id=${comment.id}>
            <div class="flex-center avatar desktop">
                <img src=${currentUser.image.webp} alt="avatar">
            </div>
            <textarea rows="5"></textarea>
            <button class="replay-send desktop">
                REPLY
            </button>
            <div class="avatar-reply mobile">
                <div class="flex-center">
                    <img src=${currentUser.image.webp} alt="avatar">
                </div>
                <button>
                    REPLY
                </button>
            </div>
        </div>
    `
}

const replysContainer = () => {
    return `
    `
}

const addCommentContainer = (currentUser) => {
    return `
        <div class="add-comment">
            <div class="flex-center avatar desktop">
                <img src=${currentUser.image.webp} alt="avatar">
            </div>
            <textarea rows="5" placeholder="Add a comment" class="new-comment"></textarea>
            <button class="reply-send desktop send-comment">
                SEND
            </button>
            <div class="avatar-reply mobile">
                <div class="flex-center">
                    <img src="./images/avatars/image-juliusomo.webp" alt="avatar">
                </div>
                <button class="send-comment">
                    SEND
                </button>
            </div>
        </div>
    `
}

function getData() {
    return fetch("./data.json")
        .then((res) => {
            return res.json();
        })
}

async function load() {

    // this is for creating new comment because i need a new id
    let lastId;

    const data = JSON.parse(localStorage.getItem('data')) || await getData();

    localStorage.setItem('data', JSON.stringify(data))

    mainContainer.innerHTML = '';

    // loading comments to DOM
    data.comments.forEach((comment) => {

        const container = document.createElement('div');
        container.classList.add('container')
        container.innerHTML += commentContainer(comment)
        container.innerHTML += replyContainer(data.currentUser, comment)
        mainContainer.append(container)

        lastId = comment.id;

        if (comment.replies[0] != undefined) {
            const repliesHead = `
                <div class="replys-container">
                <div class="line"></div>
                <div class="replys">
            `

            const repliesBottom = `
                </div>
                </div>
            `
            let repliesContent = '';

            // loading the replies for each comment
            comment.replies.forEach(reply => {
                let container = '<div class="container">';
                container += commentContainer(reply)
                container += replyContainer(data.currentUser, reply)
                container += '</div>'
                repliesContent += container;

                lastId = reply.id;
            })

            mainContainer.innerHTML += repliesHead + repliesContent + repliesBottom
        }

    })

    mainContainer.innerHTML += addCommentContainer(data.currentUser)

    const upvoteButton = document.querySelectorAll('.upvote');
    const downvoteButton = document.querySelectorAll('.downvote');
    const replyButton = document.querySelectorAll('.reply-button');
    const replyContainerHtml = document.querySelectorAll('.reply-container');
    const newComment = document.querySelector('.new-comment');
    const sendComment = document.querySelectorAll('.send-comment');



    upvoteButton.forEach(el => {
        el.addEventListener('click', (e) => {
            upvote(e, data)
        });
    });

    downvoteButton.forEach(el => {
        el.addEventListener('click', (e) => {
            downvote(e, data)
        });
    });


    replyButton.forEach(b => {
        b.addEventListener('click', () => {
            showReplyContainer(b.id, replyContainerHtml)
        })
    })

    sendComment.forEach(button => {
        button.addEventListener('click', () => {
            if (newComment.value !== '') {
                addNewComment(newComment.value, lastId, data)
            }
        })
    })
}


function upvote(e, data) {

    const commentId = Number(e.target.parentNode.id)
    for (const comment of data.comments) {
        if (comment.id == commentId) {

            if (comment?.voted == -1) {
                comment.voted = 0
                comment.score++;
                localStorage.setItem('data', JSON.stringify(data))
                load()
            } else if (comment?.voted == 0 || !comment.hasOwnProperty('voted')) {
                comment.voted = 1
                comment.score++;
                localStorage.setItem('data', JSON.stringify(data))
                load()
            }
        } else {
            comment.replies.forEach(reply => {
                if (reply.id == commentId) {
                    if (reply?.voted == -1) {
                        reply.voted = 0
                        reply.score++;
                        localStorage.setItem('data', JSON.stringify(data))
                        load()
                    } else if (reply?.voted == 0 || !reply.hasOwnProperty('voted')) {
                        reply.voted = 1
                        reply.score++;
                        localStorage.setItem('data', JSON.stringify(data))
                        load()
                    }
                }
            })
        }

    }
}

function downvote(e, data) {
    const commentId = Number(e.target.parentNode.id)
    for (const comment of data.comments) {
        if (comment.id == commentId) {
            if (comment?.voted == 1) {
                comment.voted = 0
                comment.score--;
                localStorage.setItem('data', JSON.stringify(data))
                load()
            } else if (comment?.voted == 0 || !comment.hasOwnProperty('voted')) {
                comment.voted = -1
                comment.score--;
                localStorage.setItem('data', JSON.stringify(data))
                load()
            }
        } else {
            comment.replies.forEach(reply => {
                if (reply.id == commentId) {
                    if (reply?.voted == 1) {
                        reply.voted = 0
                        reply.score--;
                        localStorage.setItem('data', JSON.stringify(data))
                        load()
                    } else if (reply?.voted == 0 || !reply.hasOwnProperty('voted')) {
                        reply.voted = -1
                        reply.score--;
                        localStorage.setItem('data', JSON.stringify(data))
                        load()
                    }
                }
            })
        }

    }
}

function showReplyContainer(id, replyContainers) {
    replyContainers.forEach(container => {

        if (container.id === id) {
            if (container.style.display === 'flex') {
                container.setAttribute('style', 'display:none !important');
            } else {
                container.setAttribute('style', 'display:flex !important');
            }
            return
        }
    })

}

function addNewComment(content, lastId, data) {
    const newComment = {
        "id": lastId + 1,
        "content": content,
        "createdAt": "Now",
        "score": 0,
        "user": {
            "image": {
                "png": data.currentUser.image.png,
                "webp": data.currentUser.image.webp
            },
            "username": data.currentUser.username
        },
        "replies": []
    }

    data.comments.push(newComment);
    localStorage.setItem('data', JSON.stringify(data))
    load()

}

load()




