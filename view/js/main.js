

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      if (document.querySelector('.mobile-nav-active')) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll('.swiper').forEach(function(swiper) {
      let config = JSON.parse(swiper.querySelector('.swiper-config').innerHTML.trim());
      new Swiper(swiper, config);
    });
  }
  window.addEventListener('load', initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /*Add to cart */

 // Get the cart container element
 const cartContainer = document.getElementById('cart-items');
 // Create the confirm button
 const confirmButton = document.createElement('button');
 confirmButton.classList.add('confirm-order');
 confirmButton.textContent = 'Confirm Order';
 confirmButton.addEventListener('click', placeOrder);
 
 cartContainer.appendChild(confirmButton);
 
 // Function to format price
 function formatPrice(value) {
   return new Intl.NumberFormat('de-DE').format(value) + '.000';
 }
 function formatTotalPrice(value) {
  return new Intl.NumberFormat('de-DE').format(value) + '';
}
 // Function to add an item to the cart
 function addToCart(itemName, itemPrice) {
   // Check if the item is already in the cart
   const existingCartItem = document.querySelector(`.cart-item[data-name="${itemName}"]`);
   if (existingCartItem) {
     // Increment the quantity of the existing item
     const quantityElement = existingCartItem.querySelector('.quantity');
     let quantity = parseInt(quantityElement.value);
     quantity++;
     quantityElement.value = quantity;
     updateItemPrice(existingCartItem, itemPrice, quantity);
     return;
   }
 
   // Create a new cart item element
   const cartItem = document.createElement('div');
   cartItem.classList.add('cart-item');
   cartItem.dataset.name = itemName;
 
   // Create the item name element
   const nameElement = document.createElement('h5');
   nameElement.textContent = itemName;
 
   // Create the quantity element
   const quantityContainer = document.createElement('div');
   quantityContainer.classList.add('quantity-container');
 
   const quantityMinus = document.createElement('button');
   quantityMinus.classList.add('quantity-minus');
   quantityMinus.textContent = '-';
   quantityMinus.addEventListener('click', () => updateQuantity(cartItem, itemPrice, -1));
 
   const quantityElement = document.createElement('input');
   quantityElement.classList.add('quantity');
   quantityElement.type = 'number';
   quantityElement.value = 1;
   quantityElement.min = 1;
   quantityElement.addEventListener('input', () => updateItemPrice(cartItem, itemPrice, quantityElement.value));
 
   const quantityPlus = document.createElement('button');
   quantityPlus.classList.add('quantity-plus');
   quantityPlus.textContent = '+';
   quantityPlus.addEventListener('click', () => updateQuantity(cartItem, itemPrice, 1));
 
   
   quantityContainer.appendChild(quantityElement);
   
 
   // Create the price element
   const priceElement = document.createElement('p');
   priceElement.classList.add('price');
   priceElement.textContent = `VND ${formatPrice(itemPrice)}`;
 
   // Create the remove button
   const removeButton = document.createElement('button');
   removeButton.textContent = 'Remove';
   removeButton.addEventListener('click', () => removeFromCart(cartItem));
 
   // Append the elements to the cart item
   cartItem.appendChild(nameElement);
   cartItem.appendChild(quantityContainer);
   cartItem.appendChild(priceElement);
   cartItem.appendChild(removeButton);
 
   // Append the cart item to the cart container
   cartContainer.appendChild(cartItem);
   toggleConfirmButton();
   updateTotalPrice();
 }
 
 function toggleConfirmButton() {
   if (cartContainer.children.length > 1) {
     confirmButton.classList.remove('hidden');
   } else {
     confirmButton.classList.add('hidden');
   }
 }
 
 // Function to update the quantity of an item in the cart
 function updateQuantity(cartItem, itemPrice, change) {
   const quantityElement = cartItem.querySelector('.quantity');
   let quantity = parseInt(quantityElement.value);
   quantity += change;
   if (quantity < 1) {
     quantity = 1;
   }
   quantityElement.value = quantity;
   updateItemPrice(cartItem, itemPrice, quantity);
   updateTotalPrice();
 }
 
 // Function to update the item price in the cart
 function updateItemPrice(cartItem, itemPrice, quantity) {
   const priceElement = cartItem.querySelector('.price');
   const finalPrice = itemPrice * quantity;
   priceElement.textContent = `VND ${formatPrice(finalPrice)}`;
   updateTotalPrice();
 }
 
 // Function to remove an item from the cart
 function removeFromCart(cartItem) {
   cartContainer.removeChild(cartItem);
   toggleConfirmButton();
   updateTotalPrice();
 }
 
 // Call the addToCart function when the "Choose Dish" button is clicked
 const chooseButtons = document.querySelectorAll('.menu-content button');
 chooseButtons.forEach((button) => {
   button.addEventListener('click', () => {
     const menuItem = button.closest('.menu-item');
     const itemName = menuItem.querySelector('.menu-content a').textContent;
     const itemPrice = parseFloat(menuItem.querySelector('.menu-content span').textContent.slice(0));
     addToCart(itemName, itemPrice);
   });
 });
 
 async function placeOrder() {
   try {
     // Lấy dữ liệu từ giỏ hàng
     const cartItems = Array.from(cartContainer.children)
       .filter((item) => item.classList.contains('cart-item'))
       .map((item) => ({
         name: item.dataset.name,
         price: parseFloat(item.querySelector('.price').textContent.replace('VND ', '').replace(/\./g, '').replace('.000', '')),
         quantity: parseInt(item.querySelector('.quantity').value),
       }));
 
     // Gửi POST request tới API
     const response = await fetch('/order', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ cartItems }),
     }).then(window.location.href = "/thanks-page.html");
 
     if (response.ok) {
       // Xử lý phản hồi thành công
       console.log('Order placed successfully');
       // Có thể thêm logic để làm sạch giỏ hàng sau khi đặt hàng thành công
     } else {
       // Xử lý lỗi
       console.error('Error placing order');
     }
   } catch (err) {
     console.error('Error:', err);
   }
 }
 
 function updateTotalPrice() {
   let totalPrice = 0;
   const cartItems = cartContainer.querySelectorAll('.cart-item');
   cartItems.forEach((item) => {
     const price = parseFloat(item.querySelector('.price').textContent.replace('VND ', '').replace(/\./g, '').replace('.000', ''));
     const quantity = parseInt(item.querySelector('.quantity').value);
     totalPrice += price ;
   });
   document.querySelector('.totalPrice').textContent = `VND ${formatTotalPrice(totalPrice)}`;
 }
 



})();