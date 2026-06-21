import { db } from "./firebase.js";


import {

collection,

addDoc,

getDocs,

query,

orderBy

}

from 

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const photoForm =
document.getElementById("photoForm");


const albumGrid =
document.getElementById("albumGrid");



const musicForm =
document.getElementById("musicForm");


const soundtrackList =
document.getElementById("soundtrackList");







function escapeHtml(text){


const div =
document.createElement("div");


div.textContent =
text;


return div.innerHTML;


}







function youtubeId(url){


try{


const video =
new URL(url);


return video.searchParams.get("v");


}

catch{

return null;

}


}









function createPhotoCard(url,description){


const card =
document.createElement("article");


card.className =
"photo-card";



card.innerHTML = `


<div class="image-frame">


<img src="${url}">


</div>


<div class="photo-content">


<p>

${escapeHtml(description)}

</p>


</div>


`;



return card;


}










async function loadPhotos(){



const q = query(

collection(db,"foto"),

orderBy("created_at","desc")

);



const result =
await getDocs(q);



albumGrid.innerHTML="";




result.forEach(doc=>{


const data =
doc.data();



albumGrid.appendChild(

createPhotoCard(

data.img_url,

data.description

)

);



});



}









async function uploadPhoto(file,description){



const cloudName =
"dodyzbeae";



const uploadPreset =
"albumAt";



const formData =
new FormData();



formData.append(
"file",
file
);



formData.append(

"upload_preset",

uploadPreset

);





const response =
await fetch(

`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,

{

method:"POST",

body:formData

}

);





const image =
await response.json();





await addDoc(

collection(db,"foto"),

{


img_url:image.secure_url,


description,


created_at:new Date()


}


);



}











photoForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



const file =
document.getElementById("photoFile").files[0];



const description =
document.getElementById("photoDescription").value;



await uploadPhoto(

file,

description

);



photoForm.reset();



loadPhotos();



}

);














async function loadSongs(){



const q = query(

collection(db,"musica"),

orderBy("created_at","desc")

);



const result =
await getDocs(q);



soundtrackList.innerHTML="";





result.forEach(doc=>{


const data =
doc.data();



const id =
youtubeId(data.youtube_url);




const card =
document.createElement("div");



card.className =
"music-card";



card.innerHTML = `


<h3>

${escapeHtml(data.title)}

</h3>



<iframe

width="100%"

height="200"

src="https://www.youtube.com/embed/${id}"

allowfullscreen>

</iframe>



`;



soundtrackList.appendChild(card);



});



}









musicForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



const title =
document.getElementById("musicTitle").value;



const url =
document.getElementById("musicLink").value;





await addDoc(

collection(db,"musica"),

{


title,


youtube_url:url,


created_at:new Date()


}

);



musicForm.reset();



loadSongs();



}

);









loadPhotos();

loadSongs();