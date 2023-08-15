const API = "http://localhost:4000/goods";

const inpName = document.querySelector("#inpName");
const inpDesc = document.querySelector("#inpDesc");
const inpImage = document.querySelector("#inpImage");
const inpPrice = document.querySelector("#inpPrice");
const btnAdd = document.querySelector("#btnAdd");
const btnOpenForm = document.querySelector("#flush-collapseOne");
const section = document.querySelector("#section");

//переменые для кнопок пагинации
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("myModal");

openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

modalCloseBtn.addEventListener("click", () => {
  exampleModal.style.display = "none";
});
// переменные для пагинации
const LIMIT = 6;
let currentPage = 1;
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    //проверка на  заполнение
    !inpName.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    return alert("Заполните все поля ");
  }
  const newProduct = {
    title: inpName.value,
    description: inpDesc.value,
    image: inpImage.value,
    price: inpPrice.value,
  };

  createItem(newProduct);
  renderGoods();
});

async function createItem(product) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  });
  myModal.style.display = "none";
  inpName.value = "";
  inpDesc.value = "";
  inpImage.value = "";
  inpPrice.value = "";
}

async function renderGoods() {
  const res = await fetch(`${API}?_page=${currentPage}&_limit=${LIMIT}`);
  const data = await res.json();
  section.innerHTML = "";
  data.forEach(({ price, title, description, image, id }) => {
    section.innerHTML += `
    <div class="card m-4 cardBook" style="width: 18rem">
      <img id="${id}" src="${image}" class"card-img-top detailsCard " style="height:280px" alt="${title}">
      <div class="card-body>
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <p class="card-text">${price}</p>
        <button class="btn btn-outline-danger btnDelete" id="${id}">Удалить</button>
        <button class="btn btn-outline-warning btnEdit" id="${id}"
          data-bs-target="#exampleModal"
          data-bs-toggle="modal"
        >
          Изменить
        </button>
      </div>
    </div>
    `;
  });
  //   pageFunc();
}

// async function pageFunc() {
//   const res = await fetch(API);
//   const data = await res.json();
//   countPage = Math.ceil(data.length / LIMIT);
//   if (currentPage === countPage) {
//     nextBtn.parentElement.classList.add("disabled");
//   } else {
//     nextBtn.parentElement.classList.remove("disabled");
//   }

//   if (currentPage === 1) {
//     prevBtn.parentElement.classList.add("disabled");
//   } else {
//     prevBtn.parentElement.classList.remove("disabled");
//   }
// }

//delete

document.addEventListener("click", async ({ target: { classList, id } }) => {
  const delClass = [...classList];
  if (delClass.includes("btnDelete")) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      renderGoods();
    } catch (error) {
      console.log(error);
    }
  }
});

renderGoods();

//edit

const editInpName = document.querySelector("#editInpName");
const editInpDesc = document.querySelector("#editInpDesc");
const editInpImage = document.querySelector("#editInpImage");
const editInpPrice = document.querySelector("#editInpPrice");
const editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", async ({ target: { classList, id } }) => {
  const classes = [...classList];
  if (classes.includes("btnEdit")) {
    exampleModal.style.display = "block";
    const res = await fetch(`${API}/${id}`);
    const {
      title,
      description,
      image,
      price,
      id: productId,
    } = await res.json();
    editInpName.value = title;
    editInpDesc.value = description;
    editInpImage.value = image;
    editInpPrice.value = price;
    editBtnSave.setAttribute("id", productId);
  }
});

editBtnSave.addEventListener("click", () => {
  const editedProduct = {
    title: editInpName.value,
    description: editInpDesc.value,
    image: editInpImage.value,
    price: editInpPrice.value,
  };
  editProduct(editedProduct, editBtnSave.id);
  exampleModal.style.display = "none";
});

async function editProduct(product, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(product),
    });
    renderGoods();
  } catch (error) {
    console.log("error");
  }
}

// prevBtn.addEventListener("click", () => {
//   if (currentPage <= 1) return;
//   currentPage--;
//   renderGoods();
// });

// nextBtn.addEventListener("click", () => {
//   if (currentPage >= countPage) return;

//   currentPage++;

//   renderGoods();
// });
