const list = document.querySelector("ul");
const buttonShowAll = document.querySelector(".show-all");
const buttonMapAll = document.querySelector(".map-all");
const sumAll = document.querySelector(".sum-all");
const filterAll = document.querySelector(".filter-all");
const drinksAll = document.querySelector(".drinks-all");
const dessertsAll = document.querySelector(".desserts-all");
const buttonNextStep = document.querySelector(".next-step");
const selectedProducts = new Set();

function formatCurrency(value) {
  const newValue = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return newValue;
}

function getProductPrice(product) {
  if (typeof product.price === "number") {
    return product.price;
  }

  return Number(product.price.replace("R$", "").trim().replace(",", "."));
}

function showAll(productsArray) {
  let myLi = "";

  productsArray.forEach((product) => {
    const isSelected = selectedProducts.has(product.name);
    myLi += `
      <li
        class="${isSelected ? "selected" : ""}"
        data-product-name="${product.name}"
        role="button"
        tabindex="0"
        aria-pressed="${isSelected}"
      >
        <img src="${product.src}" alt="${product.name}">
        <p>${product.name}</p>
        <p class="item-price">
          ${formatCurrency(getProductPrice(product))}
          ${
            product.discount
              ? `<span class="discount-value">- ${formatCurrency(product.discount)}</span>`
              : ""
          }
        </p>
      </li>
    `;
  });

  list.innerHTML = myLi;
}

function mapAllItems() {
  const newPrices = menuOptions.map((product) => {
    const originalPrice = getProductPrice(product);
    const discount = originalPrice * 0.1;

    return {
      ...product,
      price: originalPrice - discount,
      discount,
    };
  });

  showAll(newPrices);
}

function sumAllItems() {
  const cartProducts = menuOptions.filter((product) =>
    selectedProducts.has(product.name),
  );
  const totalValue = cartProducts.reduce(
    (total, product) => total + getProductPrice(product),
    0,
  );

  list.innerHTML = `
    <li class="cart-summary">
      <p class="cart-heading">Sua compra</p>
      <div class="cart-items">
        ${
          cartProducts.length
            ? cartProducts
                .map(
                  (product) => `
                    <p class="cart-item">
                      <span>${product.name}</span>
                      <span>${formatCurrency(getProductPrice(product))}</span>
                    </p>
                  `,
                )
                .join("")
            : '<p class="empty-cart">Nenhum produto selecionado.</p>'
        }
      </div>
      <p class="cart-total">Total da compra: ${formatCurrency(totalValue)}</p>
      <fieldset class="payment-options">
        <legend>Como deseja pagar?</legend>
        <label>
          <input type="radio" name="payment-method" value="pix">
          Pix (10% de desconto)
        </label>
        <label>
          <input type="radio" name="payment-method" value="other">
          Outra forma de pagamento
        </label>
      </fieldset>
      <p class="pix-total" aria-live="polite" hidden>
        Total no Pix: ${formatCurrency(totalValue * 0.9)}
      </p>
    </li>
  `;
}

function filterAllItems() {
  const filterJustVegan = menuOptions.filter((product) => product.vegan);
  showAll(filterJustVegan);
}

function showAllDrinks() {
  const drinks = menuOptions.filter((product) => product.category === "bebida");
  showAll(drinks);
}

function showAllDesserts() {
  const desserts = menuOptions.filter(
    (product) => product.category === "sobremesa",
  );
  showAll(desserts);
}

function showNonVeganSnacks() {
  const snacks = menuOptions.filter(
    (product) =>
      (!product.vegan || product.name === "Batata Frita") && !product.category,
  );
  showAll(snacks);
}

function toggleProductSelection(item) {
  const productName = item.dataset.productName;
  const isSelected = selectedProducts.has(productName);

  if (isSelected) {
    selectedProducts.delete(productName);
  } else {
    selectedProducts.add(productName);
  }

  item.classList.toggle("selected", !isSelected);
  item.setAttribute("aria-pressed", String(!isSelected));
}

list.addEventListener("click", (event) => {
  const item = event.target.closest("li[data-product-name]");

  if (item) {
    toggleProductSelection(item);
  }
});

list.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const item = event.target.closest("li[data-product-name]");

  if (item) {
    event.preventDefault();
    toggleProductSelection(item);
  }
});

list.addEventListener("change", (event) => {
  if (event.target.name !== "payment-method") {
    return;
  }

  const pixTotal = list.querySelector(".pix-total");
  pixTotal.hidden = event.target.value !== "pix";
});

buttonShowAll.addEventListener("click", showNonVeganSnacks);
buttonMapAll.addEventListener("click", mapAllItems);
sumAll.addEventListener("click", sumAllItems);
filterAll.addEventListener("click", filterAllItems);
drinksAll.addEventListener("click", showAllDrinks);
dessertsAll.addEventListener("click", showAllDesserts);
buttonNextStep.addEventListener("click", sumAllItems);