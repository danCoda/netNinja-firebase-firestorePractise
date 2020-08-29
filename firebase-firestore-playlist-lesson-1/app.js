const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = "x";

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // Deleting data
    cross.addEventListener("click", e => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id"); // See li.setAttribute('data-id', doc.id); above.
        
        // Find the document, and delete.
        db.collection("cafes").doc(id).delete();
    });
}

// getting data

// Filtering:
//db.collection('cafes').where("city", "==", "Sydney").get().then(snapshot => {
db.collection('cafes').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    });
});

// Saving data
form.addEventListener("submit", event => {
    event.preventDefault(); // So that the page doesn't reload. 
    db.collection("cafes").add({
        name: form.name.value,
        city: form.city.value
    });
    form.reset();
});
