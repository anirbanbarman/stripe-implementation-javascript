
document.addEventListener("DOMContentLoaded",function(){
    const address={
        email:"",
        phone:""
    };
    const items = [
        {
            id: "1",
            name: "Fish Rice",
            description: "Staple rice served with a variety of fish curries cooked with spices and herbs.",
            price: 100,
            image: "http://res.cloudinary.com/anirbancloud/image/upload/v1711118483/wnxe0krscvk9ikggpqd2.jpg",
            category: "Fish",
            isActive: true,
            quantity: 1
        },
        {
            id: "2",
            name: "Hilsha Polao",
            description: "A traditional Bengali delicacy made with fragrant rice and Hilsha fish, cooked together with spices and ghee, creating a rich and flavorful dish.",
            price: 150,
            image: "http://res.cloudinary.com/anirbancloud/image/upload/v1711122093/w91fje5xiehk9wk7r3rb.jpg",
            category: "pulao",
            isActive: true,
            quantity: 1
        }
    ];
    const url = "http://localhost:4200";

    const itemsContainer = document.getElementById("items-container");
    const totalPriceElement = document.getElementById("total-price");
    const payNowButton = document.getElementById("pay-now-button");

    function renderItems() {
        itemsContainer.innerHTML = "";
        items.forEach((item, i) => {
            const card = document.createElement("div");
            card.className = "card";

            const img = document.createElement("img");
            img.src = item.image;

            const desc = document.createElement("div");
            desc.className = "desc";

            const name = document.createElement("h3");
            name.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const price = document.createElement("h3");
            price.textContent = `Price: ₹ ${item.price}`;

            desc.appendChild(name);
            desc.appendChild(description);
            desc.appendChild(price);

            card.appendChild(img);
            card.appendChild(desc);

            itemsContainer.appendChild(card);
        });

        const totalPrice = items.reduce((a, b) => {
            return a + (b.price * b.quantity);
        }, 0);
        totalPriceElement.textContent = `Total: ₹ ${totalPrice}`;
    }
    async function payNow() {
        const totalPrice = items.reduce((a, b) => {
            return a + (b.price * b.quantity);
        }, 0);

        const orderData = {
            address,
            items,
            amount: totalPrice
        };

        try {
            const response = await fetch(url + "/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (data.success) {
                const { session_url } = data;
                window.location.replace(session_url);
            } else {
                console.error("Something Went Wrong");
            }
        } catch (error) {
            console.error("Error during payment", error);
        }
    }

    payNowButton.addEventListener("click", payNow);

    renderItems();



    
})