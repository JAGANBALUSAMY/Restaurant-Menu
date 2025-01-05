document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuItems = document.querySelectorAll(".menu-item");
  const homeIcon = document.getElementById("homeIcon");
  const modal = document.querySelector(".dish-details");
  const closeModalButton = document.querySelector(".close-btn");
  const wishlistButton = document.getElementById("viewWishlist");
  const cartButton = document.getElementById("viewCart");
  const wishlistModal = document.getElementById("wishlist-modal");
  const cartModal = document.getElementById("cart-modal");
  const closeWishlistButton = document.getElementById("closeWishlist");
  const closeCartButton = document.getElementById("closeCart");
  const wishlistItems = document.getElementById("wishlist-items");
  const cartItems = document.getElementById("cart-items");
  const orderHistoryButton = document.getElementById("viewOrderHistory");
  const orderHistoryModal = document.getElementById("order-history-modal");
  const orderHistoryItems = document.getElementById("order-history-items");
  const closeOrderHistoryButton = document.getElementById("closeOrderHistory");

  const cart = [];
  const wishlist = [];
  const orderHistory = [];

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      const filterType = button.getAttribute("data-filter");

      // Loop over all menu items
      menuItems.forEach(item => {
        const category = item.dataset.type;
        
        // Show/hide menu items based on filter
        if (filterType === "all" || category === filterType) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Search functionality
  searchBar.addEventListener("input", function () {
    const searchTerm = searchBar.value.toLowerCase();

    menuItems.forEach(item => {
      const title = item.querySelector("h3").textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });

  // Menu item processing
  menuItems.forEach(item => {
    const addToCartButton = item.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", function (event) {
      const dishId = item.dataset.id;
      const dishTitle = item.querySelector("h3").textContent;
      const dishPrice = parseFloat(item.querySelector(".price").textContent.replace('$', '').trim());

      // Add the dish to the cart as an object
      cart.push({ title: dishTitle, price: dishPrice });
      alert(`${dishTitle} added to your cart!`);
      event.stopPropagation();
    });
  });

  // Add to Wishlist
  menuItems.forEach(item => {
    const addToWishlistButton = item.querySelector(".add-to-wishlist");
    addToWishlistButton.addEventListener("click", function (event) {
      const dishId = item.dataset.id;
      const dishTitle = item.querySelector("h3").textContent;
      const dishPrice = parseFloat(item.querySelector(".price").textContent.replace('$', '').trim());

      // Add the dish to the wishlist as an object
      if (!wishlist.some(dish => dish.title === dishTitle)) {
        wishlist.push({ title: dishTitle, price: dishPrice });
        alert(`${dishTitle} added to your wishlist!`);
      }
      event.stopPropagation();
    });
  });

  // Show Wishlist Modal
  wishlistButton.addEventListener("click", function () {
    wishlistItems.innerHTML = wishlist.map((item, index) => `
      <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;${item.title}</span>
        <button class="edit-button" data-index="${index}" style="margin-left: 20px;">Remove</button>
        <button class="move-to-cart-button" data-index="${index}" style="margin-left: 10px;">Move to Cart</button>
      </li>
    `).join('');
    
    wishlistModal.style.display = 'block';
    wishlistItems.style.listStyleType = 'none';

    // Add event listeners for the remove and move-to-cart buttons
    updateWishlistEventListeners();
  });

  function updateWishlistEventListeners() {
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', function () {
        const itemIndex = this.getAttribute('data-index');
        wishlist.splice(itemIndex, 1); // Remove the item from the wishlist
        updateWishlistDisplay(); // Update the displayed wishlist
      });
    });

    document.querySelectorAll('.move-to-cart-button').forEach(button => {
      button.addEventListener('click', function () {
        const itemIndex = this.getAttribute('data-index');
        const item = wishlist[itemIndex]; // Get the item from the wishlist
        wishlist.splice(itemIndex, 1); // Remove the item from the wishlist
        cart.push(item); // Add the item to the cart
        updateWishlistDisplay(); // Update the wishlist display
        updateCartDisplay(); // Update the cart display
      });
    });
  }

  // Function to update the wishlist display
  function updateWishlistDisplay() {
    wishlistItems.innerHTML = wishlist.map((item, index) => `
      <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;${item.title}</span>
        <button class="edit-button" data-index="${index}" style="margin-left: 20px;">Remove</button>
        <button class="move-to-cart-button" data-index="${index}" style="margin-left: 10px;">Move to Cart</button>
      </li>
    `).join('');
    
    // Re-add event listeners for the remove and move-to-cart buttons
    updateWishlistEventListeners();
  }

  // Function to update the cart display
  function updateCartDisplay() {
    cartItems.innerHTML = '';
    let totalAmount = 0;
    let romanNumerals = ['i)', 'ii)', 'iii)', 'iv)', 'v)', 'vi)', 'vii)', 'viii)', 'ix)', 'x)'];

    cart.forEach((item, index) => {
      const romanNumeral = romanNumerals[index] || `${index + 1})`;
      cartItems.innerHTML += `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
          &nbsp;&nbsp;&nbsp;&nbsp;${romanNumeral} ${item.title}
          <button class="edit-cart-button" data-index="${index}" style="margin-left: 20px;">Remove</button>
        </li><br>
      `;
      totalAmount += item.price;
    });

    // Display total price with indentation
    const totalElement = document.createElement('li');
    totalElement.id = 'cart-total';
    totalElement.textContent = `Total - $${totalAmount.toFixed(2)}`;
    totalElement.style.marginLeft = '80px';
    totalElement.style.listStyleType = 'none';

    // Append the total to the list
    cartItems.appendChild(totalElement);

    // Add the "Place Order" button
    cartItems.appendChild(createPlaceOrderButton());
  }

  // Function to create Place Order button
  function createPlaceOrderButton() {
    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.style.marginLeft = '80px';
    placeOrderButton.style.marginTop = '10px';

    placeOrderButton.addEventListener('click', function() {
      orderHistory.push(...cart);
      cart.length = 0;
      alert('Your order has been placed!');
      updateOrderHistoryDisplay();
      updateCartDisplay();
      orderHistoryModal.style.display = 'block';
    });

    return placeOrderButton;
  }

  // Show Cart Modal
  cartButton.addEventListener("click", function () {
    updateCartDisplay();
    cartModal.style.display = 'block';
  });

  // Remove Cart Item
  function removeCartItem(index) {
    const itemPrice = cart[index].price;
    cart.splice(index, 1); // Remove the item from the cart

    const totalElement = document.getElementById('cart-total');
    const currentTotal = parseFloat(totalElement.textContent.replace('Total - $', ''));
    const newTotal = currentTotal - itemPrice;

    totalElement.textContent = `Total - $${newTotal.toFixed(2)}`;
    updateCartDisplay();
  }

  // Order History
  function updateOrderHistoryDisplay() {
    let totalAmount = 0;
    let romanNumerals = ['i)', 'ii)', 'iii)', 'iv)', 'v)', 'vi)', 'vii)', 'viii)', 'ix)', 'x)'];
  
    orderHistoryItems.innerHTML = orderHistory.map((item, index) => {
      totalAmount += item.price;
      const romanNumeral = romanNumerals[index] || `${index + 1})`; // Fallback to regular number if there are more than 10 items
      return `<li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">&nbsp;&nbsp;&nbsp;&nbsp;${romanNumeral} ${item.title}</li><br>`;
    }).join('');
  
    // Adding the total price of the order
    const totalElement = document.createElement('li');
    totalElement.textContent = `Total Order Amount: $${totalAmount.toFixed(2)}`;
    totalElement.style.marginLeft = '40px';
    totalElement.style.listStyleType = 'none';
    orderHistoryItems.appendChild(totalElement);
  }
  

  // Open the Order History Modal
  orderHistoryButton.addEventListener("click", function () {
    updateOrderHistoryDisplay();
    orderHistoryModal.style.display = 'block';
  });

  // Close Modals
  closeWishlistButton.addEventListener("click", function () {
    wishlistModal.style.display = 'none';
  });

  closeCartButton.addEventListener("click", function () {
    cartModal.style.display = 'none';
  });

  closeOrderHistoryButton.addEventListener("click", function () {
    orderHistoryModal.style.display = 'none';
  });

  // Home icon click - scroll to top
  homeIcon.addEventListener("click", function () {
    window.scrollTo(0, 0);
  });
});
