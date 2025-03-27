const baseURL = "http://localhost:3000/ramens";

function displayRamens(ramens) {
    const ramenMenu = document.getElementById("ramen-menu");
    ramenMenu.innerHTML = ""; // Clear existing images

    ramens.forEach(ramen => {
        const img = document.createElement("img");
        img.src = ramen.image;
        img.alt = ramen.name;
        img.dataset.id = ramen.id; // Store ramen ID for click event
        ramenMenu.appendChild(img);
    });
}

function handleClick(event) {
    const ramenId = event.target.dataset.id;
    if (ramenId) {
        fetch(`${baseURL}/${ramenId}`)
            .then(response => response.json())
            .then(ramen => {
                document.getElementById("ramen-comment").textContent = ramen.comment;
                document.getElementById("ramen-rating").textContent = ramen.rating;
                document.getElementById("new-rating").value = ramen.rating;
                document.getElementById("new-comment").value = ramen.comment;
                document.getElementById("edit-ramen").dataset.id = ramen.id;
            });
    }
}

function addSubmitListener() {
    const newRamenForm = document.getElementById("new-ramen");
    newRamenForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newRamen = {
            name: document.getElementById("name").value,
            image: document.getElementById("image").value,
            rating: parseInt(document.getElementById("new-ramen-rating").value),
            comment: document.getElementById("new-ramen-comment").value
        };
        fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newRamen)
        })
        .then(response => response.json())
        .then(ramen => {
            displayRamens([ramen]);
            newRamenForm.reset();
            fetch(baseURL).then(res => res.json()).then(displayRamens);
        })
        .catch(error => console.error("Error adding ramen:", error));
    });

    const editRamenForm = document.getElementById("edit-ramen");
    editRamenForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const ramenId = editRamenForm.dataset.id;
        const updatedRamen = {
            rating: parseInt(document.getElementById("new-rating").value),
            comment: document.getElementById("new-comment").value
        };
        fetch(`${baseURL}/${ramenId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRamen)
        })
        .then(response => response.json())
        .then(ramen => {
          handleClick({target : document.querySelector(`img[data-id="${ramenId}"]`)})
        })
        .catch(error => console.error("Error updating ramen:", error));
    });
}
function main() {
    fetch(baseURL)
        .then(response => response.json())
        .then(ramens => {
            displayRamens(ramens);
            if (ramens.length > 0) {
                handleClick({ target: { dataset: { id: ramens[0].id } } });
            }
        });
    addSubmitListener();
}

document.addEventListener("DOMContentLoaded", main);