
const productD = document.getElementById('productDescription');

function addToCart(productName, price, pictureUrl) {
    
    
    console.log('Adding item to cart:', pictureUrl); // Log the picture URL
    const item = {
        name: productName,
        price: price,
        picture: pictureUrl, // Include picture URL
    };
  
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    .then(response => {
        if (response.ok) {
            console.log('Item added to cart successfully.');
            showPopup('Item added to the cart!' , 1)
            
        } else {
            console.log('Failed to add item to cart.');
            
            showPopup('Failed to add item to cart.' , 0)
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the item to the cart.');
    });
}






function showPopup(message , n) {
    const popup = document.getElementById('popup');
    if(n==1){

        popup.textContent = message; // Set the message text
        popup.classList.remove('hidden'); // Show the popup
    
        // Hide the popup after 1 second
        setTimeout(() => {
            popup.classList.add('hidden');
            console.log("inner chek")
        }, 1000);
    }
    else{

        popup.textContent = message; // Set the message text
        popup.classList.remove('hidden'); // Show the popup
    
        // Hide the popup after 1 second
        setTimeout(() => {
            popup.classList.add('hidden');
            console.log("inner chek")
        }, 1000);
    }

}



function showproductdetails(name, price,image) {

    console.log("showing the data of the item")
    // const productD = document.getElementById('productDescription');
    if (!productD) {
        console.error('Product description popup element not found');
        return;
    }

    try {

        productD.innerHTML='';
       

        const productHTML = `


        
         <button onclick="closePopup()" class="absolute top-4 right-4 text-white hover:text-gray-200" aria-label="Close popup">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="grid md:grid-cols-2 grid-cols-1 h-full gap-2 md:gap-8">
      <!-- Image Section -->
      <div class="flex items-center justify-center">
        <img  class="h-[80%]  lg:h-[70%] rounded-lg shadow-lg" src="${image}" alt="Product Image">
      </div>
      <!-- Details Section -->
      <div class="flex flex-col justify-between">
        <div>
          <h2  class="text-3xl font-bold text-white mb-4">${name}</h2>
          <p  class="text-xl text-gray-200 mb-6">₹${price}</p>
          <p  class="text-gray-300 mb-8">
            Crafted with precision, this premium denim ensures ultimate comfort and style. Its durable stretch fabric is perfect for daily wear.
          </p>
  
          <!-- Additional Product Details -->
          <div class="space-y-4">
            <div>
              <h4 class="text-gray-200 font-semibold mb-2">Available Sizes:</h4>
              <div class="flex space-x-2">
                <span class="text-gray-300 text-sm px-3 py-1 bg-blue-700/50 rounded-full">28</span>
                <span class="text-gray-300 text-sm px-3 py-1 bg-blue-700/50 rounded-full">30</span>
                <span class="text-gray-300 text-sm px-3 py-1 bg-blue-700/50 rounded-full">32</span>
                <span class="text-gray-300 text-sm px-3 py-1 bg-blue-700/50 rounded-full">34</span>
              </div>
            </div>
            <div>
              <h4 class="text-gray-200 font-semibold mb-2">Key Features:</h4>
              <ul class="list-disc list-inside text-gray-300 text-sm">
                <li>High-quality stretch denim for superior comfort.</li>
                <li>Slim fit design with a stylish look.</li>
                <li>5-pocket style with secure button closure.</li>
                <li>Machine washable for easy care.</li>
              </ul>
            </div>
            <div>
              <h4 class="text-gray-200 font-semibold mb-2">Care Instructions:</h4>
              <p class="text-gray-300 text-sm">
                Machine wash cold, gentle cycle. Do not bleach. Tumble dry low. Iron on low heat if needed.
              </p>
            </div>
          </div>
        </div>
      
     
      </div>
    </div>
`;
productD.innerHTML = productHTML;
productD.classList.remove('hidden');



    console.log("niche the detail")

    }catch(error) {
        console.error('Error showing product details:', error);
       
    }


      
}


function closePopup() {
   
    if (productD) {
        
        productD.classList.add('hidden');
        productD.innerHTML = '';

    }
}


document.addEventListener('click', function(event) {
    if (!productD.contains(event.target) && !event.target.closest('.product-card')) {
        closePopup();
    }
});


