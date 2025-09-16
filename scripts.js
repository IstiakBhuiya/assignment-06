// loading Section ----------------------------------------------------------------------------------------------------------------------

const loadTreesMenu = () => {
  fetch("https://openapi.programming-hero.com/api/categories") // promise of response
    .then((res) => res.json()) // promise of json data
    // .then((json) => displayPlant(json.plants));
    .then((json) => displayCatagories(json.categories));
};
// Load all plants by default------------------------------------------
const loadAllPlants = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      displayCatagoryPlant(data.plants);
      manageSpinner(false);
    });
};

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("gallery-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("gallery-container").classList.remove("hidden");
  }
};

const removeActive = () => {
  const catbuttons = document.querySelectorAll(".cat-btn");
  // console.log(catbuttons);
  catbuttons.forEach((btn) => btn.classList.remove("active"));
};

const loadCatagoryPlantCards = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); // all active class removed
      const clickedBtn = document.getElementById(`cat-btn-${id}`);
      // console.log(clickedBtn);

      clickedBtn.classList.add("active"); // all active class added
      displayCatagoryPlant(data.plants);
    });
};

const loadTreeDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;

  const res = await fetch(url);
  const details = await res.json();
  displayTreeDetail(details.plants);
};
// displaying Section-------------------------------------------------------------------------------------------------------------------
/*
 {
    "id": 10,
    "image": "https://i.ibb.co.com/50K7Cgv/amla-min.jpg",
    "name": "Amla Tree",
    "description": "A small to medium tree producing fruits rich in Vitamin C and antioxidants. Its fruits are used in Ayurvedic tonics for boosting immunity.",
    "category": "Medicinal Tree",
    "price": 550
} 
  
 */

const displayTreeDetail = (tree) => {
  console.log(tree);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
            <h2 class="font-bold text-2xl">${tree.name}</h2>
            <div><img src="${tree.image}" alt="" /></div>
            <p><span class="font-semibold">Category: </span> ${tree.category}</p>
            <p><span class="font-semibold">Price:</span> <span> ৳</span>${tree.price}</p>
            <p><span class="font-semibold">Description:</span> ${tree.description}</p>
  `;
  document.getElementById("tree_Modal").showModal();
};

const displayCatagoryPlant = (trees) => {
  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = "";

  trees.forEach((tree) => {
    console.log(tree);
    const card = document.createElement("div");
    card.innerHTML = `
    
      <div class="card bg-base-100 shadow-sm h-[550px]">
        <figure class="mt-5 mx-5">
          <img src="${tree.image}" alt="Trees" class="rounded-lg w-full"/>
        </figure>
        <div class="card-body">
          <h2 onclick="loadTreeDetail(${tree.id})" class="card-title cursor-pointer">${tree.name}</h2>
          <p>${tree.description}</p>
          <div class="flex justify-between items-center">
            <h4 class="bg-[#DCFCE7] rounded-full text-[#15803D] px-4 py-2">${tree.category}</h4>
            <h4 class="font-semibold text-xl">৳ ${tree.price}</h4>
          </div>
          <div class="card-actions w-full">
            <button class="btn btn-primary w-full rounded-full mt-2">Add to Cart</button>
          </div>
        </div>
      </div>

    `;
    card
      .querySelector("button")
      .addEventListener("click", () => addToCart(tree));
    galleryContainer.append(card);
  });
  manageSpinner(false);
};

// Ctagories--------------------------------------------------------------------------display
const displayCatagories = (catagories) => {
  //  1. get the container and Empty
  const catagoriesContainer = document.getElementById("catagories-container");
  catagoriesContainer.innerHTML = "";

  //  2. get into every tree
  for (let catagory of catagories) {
    //      3. create Element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="cat-btn-${catagory.id}" onclick="loadCatagoryPlantCards(${catagory.id})" class="hover:btn hover:rounded-sm hover:bg-[#15803D] hover:text-white p-3 w-full text-left cat-btn">
        ${catagory.category_name}
    </button>
    
    `;
    //      4. append into container
    catagoriesContainer.append(btnDiv);
  }
};
// Add to Cart Function-----------------------------------------------------------------------------
let cart = [];
let total = 0;
const addToCart = (tree) => {
  const existingItem = cart.find((item) => item.id === tree.id);

  if (existingItem) {
    existingItem.quantity += 1;

    const cartItemElement = document.getElementById(`cart-item-${tree.id}`);
    cartItemElement.querySelector(".quantity").innerText =
      existingItem.quantity;
    cartItemElement.querySelector(".item-price").innerText =
      tree.price;
  } else {
    const cartItem = { ...tree, quantity: 1 };
    cart.push(cartItem);
    //=====================

    // create cart item
    const cartBox = document.createElement("div");
    cartBox.id = `cart-item-${tree.id}`;
    cartBox.classList =
      "cart-box flex justify-between items-center bg-[#F0FDF4] p-3 m-3";
    cartBox.innerHTML = `
    <div class="item space-y-2">
      <h3 class="font-bold">${tree.name}</h3>
      <h3><span class="item-price">${tree.price}</span> <span> x </span><span class="quantity">1</span></h3>
    </div>
    <div class="close text-red-400 cursor-pointer">
      <i class="fa-solid fa-xmark"></i>
    </div>
  `;

    // remove item on X click
    cartBox.querySelector(".close").addEventListener("click", () => {
      cartBox.remove();
      cart = cart.filter((item) => item.id !== tree.id);
      calculateTotal();
    });

    document.getElementById("cart-items").append(cartBox);
  }

  calculateTotal();
};
const calculateTotal = () => {
  total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").innerText = total;
};

// All Trees button click
document.getElementById("all-plants-btn").addEventListener("click", () => {
  removeActive();
  document.getElementById("all-plants-btn").classList.add("active");
  loadAllPlants();
});

// Initial Load
loadAllPlants();
loadTreesMenu();
