document.addEventListener('DOMContentLoaded', () => {
    const placeOrderButton = document.getElementById('placeOrderButton');
    const loader=document.getElementById('loader');

    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', async () => {
            try {
                loader.classList.remove('hidden');
                const cartItems = await fetchCartItems(); // Fetch items first if needed
                await placeOrder(cartItems); // Call the placeOrder function
            } catch (error) {
               loader.classList.add('hidden');

                console.error('Error:', error);
                alert('Failed to place the order. Please try again.');
            }
        });
    } else {
        console.error('Place Order button not found!');
    }
});




async function fetchCartItems() {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const items = await response.json();

        if (window.location.pathname.includes('cart.html')) {
            renderCartItems(items);
        }

        return items;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }}
    
        // Render cart items in the HTML
function renderCartItems(items) {
    const cartContainer = document.getElementById('cartContainer');
    const totalItemElement = document.getElementById('totalItem');
    const totalPriceElement = document.getElementById('totalPrice');

    cartContainer.innerHTML = ''; // Clear existing items

    let totalCost = 0;

    items.forEach(item => {
        console.log(item);
        totalCost += item.price;

        const itemCard = document.createElement('div');
        itemCard.className = 'p-4 mx-6 px-12 transform hover:shadow-black transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-800 rounded-lg';

        itemCard.innerHTML = `
            <a class="block relative h-48 rounded-lg overflow-hidden">
                <img alt="${item.name}" class="object-cover object-center w-fit h-full block" src="${item.picture}">
            </a>
            <div class="mt-4">
                <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">${item.name}</h3>
                <h2 class="text-white title-font text-lg font-medium">${item.name}</h2>
                <p class="mt-1 text-white font-bold">₹${item.price}</p>
                <button class="mt-4 bg-red-500 transform hover:shadow-black transition-transform duration-300 hover:scale-105 hover:shadow-lg  text-white py-2 px-4 rounded" onclick="removeFromCart('${item._id}')">Remove</button>
             
            </div>
        `;

        cartContainer.appendChild(itemCard);
        console.log(item._id)
    });

    // Update total items and price
    totalItemElement.textContent = `Total Items: ${items.length}`;
    totalPriceElement.textContent = `Total Price: ₹${totalCost}`;
}

async function removeFromCart(itemId) {
    try {
        console.log('Removing item with ID:', itemId);
         // Log the item ID being removed
        const response = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
        console.log('Response status:', response.status); // Log the response status
        const result = await response.json(); // Ensure this line is only declared once
        console.log('Response body:', result); // Log the response body

        if (response.ok && result.success) {
            console.log('Item removed successfully');
            
            location.reload();
        } else {
            console.error('Failed to remove item:', result.message);
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
}




// Place the order
async function placeOrder(items) {
    const loader=document.getElementById('loader');

    if (!items || items.length === 0) {
        loader.classList.add('hidden');
        alert('Your cart is empty!');

        return;
    }

    const orderDetails = items.map(item => ({
        name: item.name,
        price: item.price,
    }));

    try {
        const response = await fetch('/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: orderDetails }),
        });

        const data = await response.json();

        loader.classList.add('hidden');

        
        if (!response.ok) {
            // Check if the response status is 401 (Unauthorized)
            if (response.status === 401) {
                alert(data.message || 'Please log in to place an order.');
                window.location.href = 'login.html';
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
            return;
        }

        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            window.location.href = 'conpayment.html';
        }

  
       
        
    } catch (error) {
        loader.classList.add('hidden');

        console.error('Error placing order:', error);
        alert('Error placing your order. Please try again.');
    }
}



function orderDetails(length,totalCost){
    const orderDetails = document.getElementById('orderDetail');
    orderDetails.innerHTML = '';
    orderDetails.innerHTML = `
     <div class="flex justify-between">
                    <span class="text-lg font-semibold">Product Name:</span>
                    <span class="text-lg">Multiple </span>
                </div>
                <div class="flex justify-between">
                    <span class="text-lg font-semibold">Quantity:</span>
                    <span class="text-lg">${length}</span>
                </div>
             
                <div class="flex justify-between">
                    <span class="text-lg font-semibold">Total:</span>
                    <span class="text-lg">$${totalCost}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-lg font-semibold">Payment Method:</span>
                    <span class="text-lg">UPI</span>
                </div>`;

}

fetchCartItems();



