const log = console.log;

const wrapperPosts = document.querySelector('.wrapper');
const wrapperPagination = document.querySelector('.paginations');
const postsList = document.querySelector('.posts__list');
const containerBtn = document.querySelector('.posts__button');
const getPostsBtn = document.querySelector('.posts__get-posts');
const loader = document.getElementById('loader');

const state = {
    posts: [],
}

const notesOnPage = 5;

const createPost = (post) => `
    <div class="post">
        <h1 class="wrapper__title">${post.id}. ${post.title}</h1>
        <div class="wrapper__body">${post.body}</div>
    </div>
`;

const fillPostsList = (posts) => {
    postsList.innerHTML = "";
    setTimeout(() => {
        loader.style.display = 'none';
        wrapperPosts.style.display = 'flex';
        wrapperPagination.style.display = 'flex';
        if (posts.length) {
            generatePosts(posts);
        }
    }, 1500);
}

const generatePosts = (posts) => {
    let calcPaginations = Math.ceil(posts.length / notesOnPage);
    let start = 0;
    let end = start + notesOnPage;
    posts.slice(start, end).forEach((post, index) => postsList.innerHTML += createPost(post, index));
    for(let i = 0; i < calcPaginations; i++) {
        if(i == 0) {
            wrapperPagination.innerHTML += `<button class='paginations__btn active'>${i + 1}</button>`;
        } else {
            wrapperPagination.innerHTML += `<button class='paginations__btn'>${i + 1}</button>`;
        }
    }
    const paginatiosBtn = document.querySelectorAll('.paginations__btn');
    paginatiosBtn.forEach(button => {
        button.addEventListener('click', nextPage);
    })

}

const nextPage = (event) => {
    let pageNum = 0;
    let activeClass = document.querySelector('.active');
    if (event.currentTarget.classList.contains('active') == false) {
        pageNum += +event.currentTarget.innerText;
        let start = (pageNum - 1) * notesOnPage;
        let end = start + notesOnPage;
        activeClass.classList.remove('active');
        event.currentTarget.classList.add('active');
        postsList.innerHTML = "";
        state.posts.slice(start, end).forEach((post, index) => postsList.innerHTML += createPost(post, index));
    }
}


const handler = () => {
    containerBtn.remove();
    loader.style.display = 'flex';
    return fetch('https://jsonplaceholder.typicode.com/posts?_limit=80')
            .then((res) => { return res.ok ? res.json() : log('Error') })
            .then((data) => state.posts = [...data])
            .catch(error => log(error))
}

getPostsBtn.addEventListener('click', async () => {
    await handler();
    fillPostsList(state.posts);
});