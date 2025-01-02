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
  
    const cart = [];
    const wishlist = [];
  
    // Filter functionality
    filterButtons.forEach(button => {
      button.addEventListener("click", function () {
        const filterType = button.getAttribute("data-filter");
  
        categories.forEach((category, categoryIndex) => {
          const categorySection = document.getElementById(`category-${categoryIndex + 1}`);
          const categoryItems = categorySection.querySelectorAll(".menu-item");
          
          let itemsVisible = false;
  
          categoryItems.forEach(item => {
            if (filterType === "all" || item.dataset.type === filterType) {
              item.style.display = "block";
              itemsVisible = true;
            } else {
              item.style.display = "none";
            }
          });
  
          // Hide the category section if no items are visible
          if (itemsVisible) {
            categorySection.style.display = "block";
          } else {
            categorySection.style.display = "none";
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
  
        // Add the dish title and price to the cart
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
  
        if (!wishlist.includes(dishTitle)) {
          wishlist.push(dishTitle);
          alert(`${dishTitle} added to your wishlist!`);
        }
        event.stopPropagation();
      });
    });
  
    // Show Cart Modal
    cartButton.addEventListener("click", function () {
      // Clear previous cart items
      cartItems.innerHTML = '';
      
      // Display each cart item with its price using Roman numerals
      let totalAmount = 0;
      let romanNumerals = ['i)', 'ii)', 'iii)', 'iv)', 'v)', 'vi)', 'vii)', 'viii)', 'ix)', 'x)']; // Extendable
      
      cart.forEach((item, index) => {
        const romanNumeral = romanNumerals[index] || `${index + 1})`; // Fallback to regular numbering if more than 10 items
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
      totalElement.id = 'cart-total'; // Add an ID to easily update total
      totalElement.textContent = `Total - $${totalAmount.toFixed(2)}`;
      totalElement.style.marginLeft = '80px';
      totalElement.style.listStyleType = 'none';
      
      // Append the total to the list
      cartItems.appendChild(totalElement);
      
      // Show the cart modal
      cartModal.style.display = 'block';
      
      // Add event listeners for the edit buttons
      document.querySelectorAll('.edit-cart-button').forEach(button => {
        button.addEventListener('click', function () {
          const itemIndex = this.getAttribute('data-index');
          removeCartItem(itemIndex);
        });
      });
    });
    
    // Function to remove an item from the cart and update the display
    function removeCartItem(index) {
      const itemPrice = cart[index].price;
      cart.splice(index, 1); // Remove the item from the cart
      
      // Recalculate the total price
      const totalElement = document.getElementById('cart-total');
      const currentTotal = parseFloat(totalElement.textContent.replace('Total - $', ''));
      const newTotal = currentTotal - itemPrice;
      
      // Update the total price
      totalElement.textContent = `Total - $${newTotal.toFixed(2)}`;
      
      // Re-render the cart items
      cartItems.innerHTML = '';
      let romanNumerals = ['i)', 'ii)', 'iii)', 'iv)', 'v)', 'vi)', 'vii)', 'viii)', 'ix)', 'x)'];
      cart.forEach((item, index) => {
        const romanNumeral = romanNumerals[index] || `${index + 1})`;
        cartItems.innerHTML += `
          <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
            &nbsp;&nbsp;&nbsp;&nbsp;${romanNumeral} ${item.title}
            <button class="edit-cart-button" data-index="${index}" style="margin-left: 20px;">Remove</button>
          </li><br>
        `;
      });
      
      // Append the updated total to the list
      cartItems.appendChild(totalElement);
      
      // Re-attach event listeners to new edit buttons
      document.querySelectorAll('.edit-cart-button').forEach(button => {
        button.addEventListener('click', function () {
          const itemIndex = this.getAttribute('data-index');
          removeCartItem(itemIndex);
        });
      });
    }
    
  
    // Show Wishlist Modal
    wishlistButton.addEventListener("click", function () {
      wishlistItems.innerHTML = wishlist.map((item, index) => `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;${item}</span>
          <button class="edit-button" data-index="${index}" style="margin-left: 20px;">Remove</button>
        </li>
      `).join('');
      
      wishlistModal.style.display = 'block';
      wishlistItems.style.listStyleType = 'none';
      
      // Add event listeners for the edit buttons
      document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
          const itemIndex = this.getAttribute('data-index');
          wishlist.splice(itemIndex, 1); // Remove the item from the wishlist
          updateWishlistDisplay(); // Update the displayed wishlist
        });
      });
    });
    
    // Function to update the wishlist display
    function updateWishlistDisplay() {
      wishlistItems.innerHTML = wishlist.map((item, index) => `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;${item}</span>
          <button class="edit-button" data-index="${index}" style="margin-left: 20px;">Remove</button>
        </li>
      `).join('');
      
      // Re-add event listeners for the new edit buttons
      document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
          const itemIndex = this.getAttribute('data-index');
          wishlist.splice(itemIndex, 1);
          updateWishlistDisplay();
        });
      });
    }
    
    
  
    // Close Wishlist Modal
    closeWishlistButton.addEventListener("click", function () {
      wishlistModal.style.display = 'none';
    });
  
    // Close Cart Modal
    closeCartButton.addEventListener("click", function () {
      cartModal.style.display = 'none';
    });
  
    // Home icon click - scroll to top
    homeIcon.addEventListener("click", function () {
      window.scrollTo(0, 0);
    });
  });
  
