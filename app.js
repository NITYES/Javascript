//variables..

const cartBtn=document.querySelector(".cart-btn");
const CloseCartBtn=document.querySelector(".close-cart");
const ClearCartBtn=document.querySelector(".clear-cart");
const cartDOM=document.querySelector(".cart");
const cartOverlay=document.querySelector(".cart-overlay");
const cartItems=document.querySelector(".cart-items");
const cartTotal=document.querySelector(".cart-total");
const cartContent=document.querySelector(".cart-content");
const productsDOM=document.querySelector(".products-center");

//cart
let cart=[];

let buttonDOM=[];

//getting the products
class Products {
     async getProducts(){
         try {
            let result= await fetch("products.json");
            let data=await result.json()
            let products =data.items;
                products=products.map((items)=>{
                const {title,price}=items.fields;
                const {id}=items.sys;
                const image=items.fields.image.fields.file.url;
                return {title,price,id,image,}
            })
             return products
         } catch (error) {
             console.log(error)
         }
    }
}

//displaying products

class UI{
    displayProducts(products){
        let result="";
        products.forEach(product => {
            result +=` <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
              </div>
              <h3>${product.title}</h3>
              <h4>$${product.price}</h4>
          </article>`
          productsDOM.innerHTML=result;

        });
    
}
getBagBtn(){
    let buttons=[...document.querySelectorAll('.bag-btn')];
    buttonDOM=buttons;
    buttons.forEach(button=>{
        let id=button.dataset.id;
        let inCart=cart.find(item=>item.id==id)
        if(inCart){
            button.innerText="IN cart";
            button.disabled=true;
        }
        button.addEventListener("click",(event)=>{
            event.target.innerText="in cart";
            event.target.disabled=true;
            //get product from products
            let cartItems={...Storage.getProduct(id),
                amount:1};
            //add to cart
            cart=[...cart,cartItems  ];
            //store cart to local storage
             Storage.saveCart(cart);
            // set cart value
            this.setCartValue(cart);
            //add item to cart
            this.addCartItems(cartItems);
            //show cart
            // this.showCart();
        })
    })
}

setCartValue(cart){
  let tempTotal=0;
  let itemsTotal=0;
  cart.map(item=>{
      tempTotal +=item.price * item.amount;
      itemsTotal +=item.amount;

  })
  cartTotal.innerText=parseFloat(tempTotal.toFixed(2));
  cartItems.innerText=itemsTotal

}
addCartItems(cartItems){
    const div=document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML =` <img src=${cartItems.image} alt="products">
    <div>
        <h4>${cartItems.title}</h4>
        <h5>$${cartItems.price}</h5>
        <span class="remove-item" data-id=${cartItems.id}>remove</span>

    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${cartItems.id}></i>
        <p class="item-amount">${cartItems.amount}</p>
        <i class="fas fa-chevron-down" data-id=${cartItems.id}></i>
    </div>`
    cartContent.appendChild(div);
  
}
showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart')
}

hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
}

setApp(){
    cart=Storage.getCart();
    this.setCartValue(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click',this.showCart);
    CloseCartBtn.addEventListener('click',this.hideCart);

}
populateCart(cart){
cart.forEach(item=>this.addCartItems(item));
}

cartLogic(){
//clear the cart
ClearCartBtn.addEventListener('click',()=>{
    this.clearCart()
});

// cart functionality
cartContent.addEventListener('click',event=>{
    if(event.target.classList.contains("remove-item")){
       let removeitem=event.target;
       let removeitemid=removeitem.dataset.id;
      cartContent.removeChild(removeitem.parentElement.parentElement);
      this.removeId(removeitemid)
   this.hideCart()
    }
    else if(event.target.classList.contains("fa-chevron-up")){
        let additem=event.target;
        let additemid=additem.dataset.id;
      let tempitem= cart.find(item=>item.id==additemid);
          tempitem.amount=tempitem.amount + 1;
          Storage.saveCart(cart);
          this.setCartValue(cart)
         additem.nextElementSibling.innerText=tempitem.amount
    }
    else if(event.target.classList.contains("fa-chevron-down")){
        let loweritem=event.target;
        let loweritemid=loweritem.dataset.id;
        let tempitem=cart.find(item=>item.id==loweritemid);
        tempitem.amount=tempitem.amount - 1;
        if(tempitem.amount > 0){
            Storage.saveCart(cart);
          this.setCartValue(cart)
         loweritem.previousElementSibling.innerText=tempitem.amount
        }else{
            cartContent.removeChild(loweritem.parentElement.parentElement);
            this.removeId(loweritemid);
        }
    }
})

}
clearCart(){
let cartitem=cart.map(item=>item.id);
cartitem.forEach(id=>this.removeId(id));

while(cartContent.children.length > 0){
    cartContent.removeChild(cartContent.children[0])
}
this.hideCart(); 
}
removeId(id){
cart=cart.filter(item=>item.id !==id);
this.setCartValue(cart);
Storage.saveCart(cart);
let button=this.getSingleButton(id);
button.disabled=false;
button.innerHTML=` <i class="fas fa-shopping-cart"></i>
add to cart`

}
getSingleButton(id){
      return buttonDOM.find(buttonDOM=>buttonDOM.dataset.id===id)
}


}
//local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))
    }

    static getProduct(id){
        let products=JSON.parse(localStorage.getItem("products"));
        let product=products.find(product=>product.id==id)
        return product
        
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    const ui=new UI();
    const products=new Products();
    //set up the app 
       ui.setApp();

    products.getProducts().then(products=>{
        ui.displayProducts(products);
        Storage.saveProducts(products)
    }).then(()=>{
        ui.getBagBtn();
        ui.cartLogic();
    });
}); 