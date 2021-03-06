const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// create element & render cafe
function renderCafe(doc) {
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

    //=============================================
    // Deleting data
    //=============================================
    cross.addEventListener("click", e => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id"); // See li.setAttribute('data-id', doc.id); above.

        // Find the document, and delete.
        db.collection("cafes").doc(id).delete();
    });
}

//=============================================
// getting data
//=============================================
// Filtering:
//db.collection('cafes').where("city", "==", "Sydney").get().then(snapshot => {
// Ordering:
// db.collection('cafes').orderBy("name").get().then(snapshot => {
// Combinging. (Filtering, then ordering):
// db.collection('cafes').where("city", "==", "Marioland").orderBy("name").get().then(snapshot => {

// Get once:
/* db.collection('cafes').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    });
});  */

// React to changes:
db.collection('cafes').orderBy("city").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.type, change.doc.data());
        if (change.type === "added") { // Added, as well as initial (because you add them when page is loaded.)
            renderCafe(change.doc);
        } else if (change.type === "removed") {
            let li = cafeList.querySelector(`[data-id="${change.doc.id}"]`);
            cafeList.removeChild(li);
        }
    });
});

//=============================================
// Updating data
//=============================================
let update = false;
if (update) {
    db.collection("cafes").doc("someDocId").update({
        city: "New city"
    });
}

//=============================================
// Replacing data (set)... or creating it if it doesn't exis.
//=============================================
// Function will override the document and create a new one with the same docId.
let set = false;
if (set) {
    db.collection("cafes").doc("set").set({
        city: "New city"
    });
}

//=============================================
// Saving (ading) data
//=============================================
form.addEventListener("submit", event => {
    event.preventDefault(); // So that the page doesn't reload. 
    db.collection("cafes").add({
        name: form.name.value,
        city: form.city.value
    });
    form.reset();
});