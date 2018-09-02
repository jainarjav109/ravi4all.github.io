window.addEventListener("load", initEvents);
// var price = 0;
var count = 0;
function initEvents() {
    document.getElementById("search").addEventListener("keyup", searchProduct);
    document.getElementById("save").addEventListener("click", saveChanges);
    showAllProducts();
    loadProducts();
}

function saveChanges(){
    if(window.localStorage){
        var json = JSON.stringify(obj.itemList);
        // console.log(json);
        localStorage.setItem('cartProducts',json);
    }
    else {
        alert("Localstorage not supported...");
    }
}

function loadProducts(){
    if(localStorage.cartProducts){
        var data = JSON.parse(localStorage.cartProducts);
        obj.itemList = data;
        printItems();
        calculateTotal();
        cartCount();
    }
}

function searchProduct(){
    var toSearch = event.srcElement.value;
    products = products.filter(function(obj){
        return obj.p_name.toLowerCase().includes(toSearch.toLowerCase());
    });
    showAllProducts();
}

function showAllProducts(){
    var ul = document.getElementById("products");
    ul.innerHTML = "";
    for(var i = 0; i < products.length; i++){
        var li = document.createElement("li");
        li.className = 'product';
        li.setAttribute('title', products[i].p_id);
        // li.className = 'list-group-item product';
        var p_name = document.createElement("span");
        p_name.innerHTML = products[i].p_name;
        var p_price = document.createElement("span");
        p_price.innerHTML = products[i].p_price;
        var p_image = document.createElement("img");
        p_image.className = 'productImage';
        p_image.setAttribute('src', products[i].p_image);
        var cart_button = document.createElement("button");
        cart_button.innerHTML = "Add to Cart";
        cart_button.className = 'btn btn-primary w-50';
        li.appendChild(p_image);
        li.appendChild(p_name);
        li.appendChild(p_price);
        li.appendChild(cart_button);
        ul.appendChild(li);
        cart_button.addEventListener("click", add);
    }
}

function add(){
    var elem = event.srcElement.parentNode;
    var product = elem.childNodes;
    var elemId = elem.title;
    obj.addItem(elemId, product[1].innerHTML, product[2].innerHTML, product[0].src);
    printItems();
    calculateTotal();
    cartCount();
    notify();
}

function notify(){
    Notification.requestPermission(function(){
        // console.log("Notify User");
        var n = new Notification("Online Shopping : BMPL", {
            body : "Product added to cart",
            icon : "assets/images/success.png"
        });

        setTimeout(function(){
            n.close();
            // console.log("Notify User...");
        },7000);

    });
}

function cartCount(){
    count = obj.cartCounter();
    document.getElementById("counter").innerHTML = count;
}

function printItems() {
    var ul = document.getElementById("cartItems");
    ul.innerHTML = "";
    obj.itemList.forEach(function(elem){
        var li = document.createElement("li");
        li.className = 'product';
        li.setAttribute('title', elem.id);
        // li.className = 'list-group-item product';
        var p_name = document.createElement("span");
        p_name.innerHTML = elem.name;
        var p_price = document.createElement("span");
        p_price.innerHTML = elem.price;
        var p_image = document.createElement("img");
        p_image.className = 'productImage';
        p_image.setAttribute('src', elem.image);
        var delete_button = document.createElement("button");
        delete_button.innerHTML = "<i class='fas  fa-trash'/>";
        delete_button.className = 'btn btn-primary';
        li.appendChild(p_image);
        li.appendChild(p_name);
        li.appendChild(p_price);
        li.appendChild(delete_button);
        ul.appendChild(li);
        delete_button.addEventListener("click", deleteProduct);
    })
}

function calculateTotal(){
    var price = 0;
    for(var i = 0; i < obj.itemList.length; i++){
        price += parseInt(obj.itemList[i].price);
    }
    document.getElementById("total").innerHTML = price;
}

function deleteProduct(){
    var elem = event.srcElement.parentElement;
    var id = elem.title;
    // console.log("Deleting", elem);
    obj.deleteItem(id);
    printItems();
    calculateTotal()
    cartCount();
}