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
                    <div class="reply-button desktop">
                        <div class="flex-center">
                            <img src="./images/icon-reply.svg" alt="reply icon">
                        </div>
                        <span>Reply</span>
                    </div>
                </div>
                <div class="comment">
                    <p>
                    ${comment.content}
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
                    <div class="reply-button">
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

const replyContainer = (currentUser) => {
    return `
        <div class="reply-container">
            <div class="flex-center avatar desktop">
                <img src=${currentUser.image.webp} alt="avatar">
            </div>
            <textarea rows="5">
            </textarea>
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
            <textarea rows="5" placeholder="Add a comment">

            </textarea>
            <button class="reply-send desktop">
                SEND
            </button>
            <div class="avatar-reply mobile">
                <div class="flex-center">
                    <img src="./images/avatars/image-juliusomo.webp" alt="avatar">
                </div>
                <button>
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


    const data = JSON.parse(localStorage.getItem('data')) || await getData();

    localStorage.setItem('data', JSON.stringify(data))

    console.log(data)
    // loading comments to DOM
    mainContainer.innerHTML = '';
    data.comments.forEach((comment) => {

        const container = document.createElement('div');
        container.classList.add('container')
        container.innerHTML += commentContainer(comment)
        container.innerHTML += replyContainer(data.currentUser)
        mainContainer.append(container)
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
                container += replyContainer(data.currentUser)
                container += '</div>'
                repliesContent += container;
            })

            mainContainer.innerHTML += repliesHead + repliesContent + repliesBottom
        }

    })

    mainContainer.innerHTML += addCommentContainer(data.currentUser)

    const upvoteButton = document.querySelectorAll('.upvote');
    const downvoteButton = document.querySelectorAll('.downvote');

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
}

load()

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




