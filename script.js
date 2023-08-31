const shadow = document.querySelector('.shadow');
const deleteConfirm = document.querySelector('.delete-confirm');
const cancel = document.querySelector('.cancel')
const confirm = document.querySelector('.confirm')


const mainContainer = document.querySelector('.main-container');


const commentContainer = (data, comment) => {

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
                        ${comment.user.username === data.currentUser.username ? '<span class="you">you</span>' : ''}
                        <span class="time">
                            ${timePassed(new Date(comment.createdAt))}
                        </span>
                    </div>
                    ${comment.user.username === data.currentUser.username ?
            '<div class="edit-delete desktop" id=' + comment.id + '}><div class="edit-button" id=' + comment.id + '><div class="flex-center"><img src="./images/icon-edit.svg" alt="edit icon"></div><span>Edit</span></div><div id=' + comment.id + ' class="delete-button"><div class="flex-center"><img src="./images/icon-delete.svg" alt="delete icon"></div><span>Delete</span></div></div>'
            :
            '<div class="reply-button desktop" id=' + comment.id + '><div class="flex-center"><img src="./images/icon-reply.svg" alt="reply icon"></div><span>Reply</span></div>'
        }
                </div>
                <div class="comment" id=${comment.id}>
                    <p>
                        <span class='replying-to'>${comment.replyingTo ? '@' + comment.replyingTo : ''}</span> ${comment.content}
                    </p>
                </div>
                ${comment.user.username === data.currentUser.username ?
            '<div class="edit-container" id=' + comment.id + '><textarea rows="5" class="edit-text" id=' + comment.id + '>' + comment.content + '</textarea><button class="update">UPDATE</button></div>'
            : ''}
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
                    ${comment.user.username === data.currentUser.username ?
            '<div class="edit-delete" id=' + comment.id + '}><div class="edit-button" id=' + comment.id + '><div class="flex-center"><img src="./images/icon-edit.svg" alt="edit icon"></div><span>Edit</span></div><div id=' + comment.id + ' class="delete-button"><div class="flex-center"><img src="./images/icon-delete.svg" alt="delete icon"></div><span>delete</span></div></div>'
            :
            '<div class="reply-button" id=' + comment.id + '><div class="flex-center"><img src="./images/icon-reply.svg" alt="reply icon"></div><span>Reply</span></div>'
        }
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
            <textarea rows="5" id=${comment.id} class="reply-text"></textarea>
            <button class="reply-send desktop" id=${comment.id}>
                REPLY
            </button>
            <div class="avatar-reply mobile">
                <div class="flex-center">
                    <img src=${currentUser.image.webp} alt="avatar">
                </div>
                <button class="reply-send" id=${comment.id}>
                    REPLY
                </button>
            </div>
        </div>
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
    let lastId = 4;

    const data = JSON.parse(localStorage.getItem('data')) || await getData();

    localStorage.setItem('data', JSON.stringify(data))

    mainContainer.innerHTML = '';

    // loading comments to DOM
    data.comments.forEach((comment) => {

        const container = document.createElement('div');
        container.classList.add('container')
        container.innerHTML += commentContainer(data, comment)
        container.innerHTML += replyContainer(data.currentUser, comment)
        mainContainer.append(container)

        if (comment.id > lastId) {
            lastId = comment.id;
        }

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
                container += commentContainer(data, reply)
                container += replyContainer(data.currentUser, reply)
                container += '</div>'
                repliesContent += container;

                if (reply.id > lastId) {
                    lastId = reply.id;
                }
            })

            mainContainer.innerHTML += repliesHead + repliesContent + repliesBottom
        }

    })

    mainContainer.innerHTML += addCommentContainer(data.currentUser)

    const upvoteButton = document.querySelectorAll('.upvote')
    const downvoteButton = document.querySelectorAll('.downvote')

    const replyButton = document.querySelectorAll('.reply-button')
    const replyContainerHtml = document.querySelectorAll('.reply-container')

    const newComment = document.querySelector('.new-comment')
    const sendComment = document.querySelectorAll('.send-comment')

    const replyText = document.querySelectorAll('.reply-text')
    const replySend = document.querySelectorAll('.reply-send')

    const deleteButton = document.querySelectorAll('.delete-button')
    const editButton = document.querySelectorAll('.edit-button')
    const editContainers = document.querySelectorAll('.edit-container')

    const comments = document.querySelectorAll('.comment')


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

    replySend.forEach(b => {
        b.addEventListener('click', () => {
            addNewReply(replyText, lastId, b.id, data)
        })
    })

    editButton.forEach(b => {
        b.addEventListener('click', () => {
            toggleEditContainer(b.id, comments, editContainers, data)
        })
    })

    deleteButton.forEach(b => {
        b.addEventListener('click', () => {
            handleDelete(b.id, data)
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
            if (container.style.display === 'flex' || container.style.display === 'block') {
                container.setAttribute('style', 'display:none !important');
            } else {
                if (window.matchMedia("(min-width:700px)").matches) {
                    container.setAttribute('style', 'display:flex !important');
                } else {
                    container.setAttribute('style', 'display:block !important');
                }
            }
            return
        }
    })

}

function addNewComment(content, lastId, data) {
    const newComment = {
        "id": lastId + 1,
        "content": content,
        "createdAt": new Date(),
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

function addNewReply(replyText, lastId, replyingToId, data) {
    let content;
    replyText.forEach((e) => {
        if (e.id === replyingToId) {
            content = e.value;
        }
    })

    if (content == '') return

    data.comments.forEach(comment => {
        if (comment.id == replyingToId) {
            comment.replies.push({
                "id": lastId + 1,
                "content": content,
                "createdAt": new Date(),
                "score": 0,
                "replyingTo": comment.user.username,
                "user": {
                    "image": {
                        "png": data.currentUser.image.png,
                        "webp": data.currentUser.image.webp
                    },
                    "username": data.currentUser.username
                }
            })
        } else {
            comment.replies.forEach(reply => {
                if (reply.id == replyingToId) {
                    comment.replies.push({
                        "id": lastId + 1,
                        "content": content,
                        "createdAt": new Date(),
                        "score": 0,
                        "replyingTo": reply.user.username,
                        "user": {
                            "image": {
                                "png": data.currentUser.image.png,
                                "webp": data.currentUser.image.webp
                            },
                            "username": data.currentUser.username
                        }
                    })
                }
            })
        }
    })

    localStorage.setItem('data', JSON.stringify(data))
    load()

}

function toggleEditContainer(id, comments, containers, data) {

    containers.forEach(container => {
        if (id == container.id) {
            if (container.style.display == 'flex') {
                comments.forEach(comment => {
                    if (comment.id == id) {
                        comment.style.display = 'flex'
                    }
                })
                container.style.display = 'none'
            } else {
                comments.forEach(comment => {
                    if (comment.id == id) {
                        comment.style.display = 'none'
                    }
                })
                container.style.display = 'flex'
            }

            const textarea = container.querySelector('textarea')
            const updateButton = container.querySelector('.update')

            updateButton.addEventListener('click', () => {
                if (textarea != '') {
                    data.comments.forEach(comment => {
                        if (comment.id == id) {
                            comment.content = textarea.value
                            comment.createdAt = new Date()
                            return
                        } else {
                            comment.replies.forEach(reply => {
                                if (reply.id == id) {
                                    reply.content = textarea.value
                                    reply.createdAt = new Date()
                                }
                                return
                            })
                            return
                        }
                    })

                    localStorage.setItem('data', JSON.stringify(data))
                    load()
                }
            })
            return
        }
    })
}

function handleDelete(id, data) {
    window.scrollTo(0, 0)
    document.body.style.overflowY = 'hidden'
    shadow.style.display = 'block'
    deleteConfirm.style.display = 'block'

    cancel.addEventListener('click', () => {
        shadow.style.display = 'none'
        deleteConfirm.style.display = 'none'
        document.body.style.overflowY = 'scroll'
    })

    confirm.addEventListener('click', () => {
        data.comments.forEach((comment, index) => {
            if (comment.id == id) {
                data.comments.splice(index, 1)
            } else {
                comment.replies.forEach((reply, index) => {
                    if (reply.id == id) {
                        comment.replies.splice(index, 1)
                    }
                })
            }
        })
        shadow.style.display = 'none'
        deleteConfirm.style.display = 'none'
        document.body.style.overflowY = 'scroll'

        localStorage.setItem('data', JSON.stringify(data))
        load()
    })
}

function timePassed(givenDate) {

    const currentDate = new Date();
    const timeDifference = currentDate - givenDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Approximate months
    const years = Math.floor(months / 12); // Approximate years

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }

}

load()




