let cl = console.log;
// by using promise
/*

const post = document.querySelector('.post');

let baseurl = 'https://jsonplaceholder.typicode.com/posts';

function fetchHttpRequest(method, url) {
    let promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status === 200 && this.readyState === 4) {
                let responseData = JSON.parse(xhr.responseText)
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject('something went wrong');
            }
        }
        xhr.send();
    })
    return promise;
}
fetchHttpRequest('GET', baseurl)
    .then((d) => {
        (d)
        templating(d)
    })

    .catch((e) => cl(e))


function templating(arr) {
    let output = "";
    arr.forEach(element => {
        output += `<li class="post-item card shadow mt-5 p-5">
                    <h4>${element.title}</h4>
                    <p>${element.body}</p>
                    <button class="btn btn-danger delete">delete</button>
                    <button class="btn btn-primary">edit</button>
                </li>`
    });
    post.innerHTML = output;
    cl(post)
}

*/

const post = document.querySelector('.post');
const formData = document.getElementById('formData');
const submitbtn = document.getElementById('submitbtn');
const udatebtn = document.getElementById('udatebtn');

let baseurl = 'https://jsonplaceholder.typicode.com/posts';
let responseData = [];


function sendHTTPRequest(method, url, txdata) {
    let promise = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if ((this.status === 200 || this.status === 201) && this.readyState === 4) {
                cl(this.status, this.readyState);
                responseData = JSON.parse(xhr.responseText);
                //cl(responseData)
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject('something went wrong')
            }
        }
        xhr.send(txdata)
    })
    return promise;
}
/* // with then & catch promise without async function
sendHTTPRequest('GET', baseurl)
.then((data)=> data)
.catch((er) => cl(er))*/


// promise with async function

async function fetchData() {
    try {
        let fdata = await sendHTTPRequest('GET', baseurl);
        templating(fdata);
    } catch (error) {
        cl(error)
    }
}

const templating = ((arr) => {
    let output = "";
    arr.forEach((eve) => {
        output += `<li class="post-item card shadow mt-5 p-5" id="${eve.id}">
        <div class="card-body">
            <h4>${eve.title}</h4>
            <p>${eve.body}</p>
            <button class="btn btn-danger delete" onclick="deleteData(this)">delete</button>
            <button class="btn btn-primary" onclick="editData(this)">edit</button>
        </div>
    </li>`
    })
    post.innerHTML = output;
    cl(post)
})
fetchData()

const onSubmit = ((eve) => {
    eve.preventDefault();
    let obj = {
        title: title.value,
        body: content.value,
        userId: Math.random(),
        id: (responseData.length + 1)
    }
    responseData.push(obj);
    cl(responseData);
    templating(responseData);
    sendHTTPRequest('POST', baseurl, JSON.stringify(obj));
    formData.reset();
})
formData.addEventListener('submit', onSubmit);

//delete function
function deleteData(ele) {
    cl(ele);
    cl(ele.closest('li').id)
    let getId = ele.closest('li').id;
    cl(getId);
    let deleteUrl = `${baseurl}/${getId}`
    sendHTTPRequest('DELETE', deleteUrl);
    responseData = responseData.filter((e) => {
        return e.id != getId;
    })
    templating(responseData);
}

//edit function 

function editData(ele) {
    let getId = ele.closest('li').id;
    cl(getId);
    submitbtn.classList.add('d-none');
    udatebtn.classList.remove('d-none');
    let obj = responseData.find((eve) => {
        return eve.id == getId;
    })
    title.value = obj.title;
    content.value = obj.body;
    localStorage.setItem('localresponse', JSON.stringify(obj));
}

function updateData() {
    let localObj = JSON.parse(localStorage.getItem('localresponse'));
    cl(localObj);
    let obj = {
        title: title.value,
        body: content.value,
        userId: localObj.userId,
        id: localObj.id
    }
    cl(obj);
    let puturl = `${baseurl}/${localObj.id}`
    sendHTTPRequest('PUT', puturl)
    responseData.forEach((getobj) => {
        if (getobj.id == localObj.id) {
            getobj.title = obj.title,
                getobj.body = obj.body
        }
    })
    //localStorage.setItem('localresponse',JSON.stringify(responseData))
    cl(templating(responseData));

    formData.reset();
    submitbtn.classList.remove('d-none');
    udatebtn.classList.add('d-none');

}
udatebtn.addEventListener('click', updateData);