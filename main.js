
async function fetchItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();

        const menItemsContainer = document.getElementById('menItems');
        const womenItemsContainer = document.getElementById('womenItems');

        menItemsContainer.innerHTML = '';
        womenItemsContainer.innerHTML = '';

        items.forEach(item => {
            const itemCard = `
              <div class="  product-card py-4 hover:shadow-black shadow-2xl lg:mx-8 mx-2 px-10 lg:px-12 transform transition-transform  duration-300 hover:scale-105 hover:shadow-lg rounded-lg hover:bg-gray-800">
                <a class="block relative h-48 rounded overflow-hidden">
                <img alt="${item.name}" class="object-cover object-center w-fit h-full block  onclick" src="${item.image}" onclick="showproductdetails('${item.name}',${item.price}, '${item.image}')">
                </a>
                <div class="mt-4">
                <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">${item.name}</h3>
                <h2 class="text-white title-font text-lg font-medium">${item.name}</h2>
                <p class="mt-1">${item.price}</p>
                <button class="addToCartButton mt-4 bg-blue-500 text-white py-2 px-4 rounded transform hover:shadow-black transition-transform duration-300 hover:scale-105 hover:shadow-lg "  onclick="addToCart('${item.name}',${item.price}, '${item.image}')">Add to Cart</button>
                </div>
            </div>`;

            if (item.section === 'men') {
                menItemsContainer.innerHTML += itemCard;
            } else if (item.section === 'women') {
                womenItemsContainer.innerHTML += itemCard;
            }
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Fetch items on page load
fetchItems();
