//actual
// if (document.readyState == 'loading') {
//     document.addEventListener('DOMContentLoaded', ready)
// } else {
//     ready()--total code is in ready function
// }
let removeCartItemButtons=document.getElementsByClassName('btn-danger');
console.log(removeCartItemButtons)
for(let i=0;i<removeCartItemButtons.length;i++)
{
    var button=removeCartItemButtons[i];
    button.addEventListener('click',removeCartItem)
}
let quantityInputs=document.getElementsByClassName('cart-quant-ip');
for(let i=0;i<quantityInputs.length;i++)
{
    var input=quantityInputs[i];
    input.addEventListener('change',quantityChange);
}
let  addToCartButton=document.getElementsByClassName('shop-item-btn');
for(let i=0;i<addToCartButton.length;i++)
{
    var button=addToCartButton[i];
    button.addEventListener('click',addToCartClicked);
}
document.getElementsByClassName('btn-purchase')[0].addEventListener('click',purchaseClicked);


//after purchasing we need to clear the cart
var stripeHandler=StripeCheckout.configure({
key:stripePublicKey,
locale:'auto',
//after entering the details
token:function(token){
let items=[]
var cartItemContainer=document.getElementsByClassName('cart-items')[0];
var cartRows=cartItemContainer.getElementsByClassName('cart-row')
for(var i=0;i<cartRows.length;i++)
{
    var cartRow=cartRows[i];
    var quantEle=cartRow.getElementsByClassName('cart-quant-ip')[0];
    var quantity=quantEle.value;
    var id=cartRow.dataset.itemId;
    items.push({
        id:id,
        quantity:quantity
    })
}
fetch('/purchase',{
    method:'POST',
    headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    body:JSON.stringify({
        stripeTokenId:token.id,
        items:items
    })
}).then(function(res){
return res.json() 
}).then(function(data)
{
    alert(data.message)
   
}).catch(function(error){
    console.error(error);
})
}
})
function purchaseClicked()
{
    // alert('Thank you for purchase');
    
    var priceElement=document.getElementsByClassName('cart-total-price')[0]
    var price=parseFloat(priceElement.innerText.replace('$',''))*100
    stripeHandler.open({
        amount:price
    })
    var cartItems=document.getElementsByClassName('cart-items')[0];
    while(cartItems.hasChildNodes())
    {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}
function addToCartClicked(event)
{
    var button=event.target;
    var shopItem=button.parentElement.parentElement;
    var title=shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price=shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imgSrc=shopItem.getElementsByClassName('shop-item-img')[0].src;
    var id=shopItem.dataset.itemId
    //data-item-id=dataset.itemId
    addItemToCart(title,price,imgSrc,id);
    updateCartTotal();

}
function addItemToCart(title,price,imgSrc,id)
{
    var cartRow=document.createElement('div');
    //cartRow.innerText=title;
   cartRow.classList.add('cart-row');
   cartRow.dataset.itemId=id;
    var cartItems=document.getElementsByClassName('cart-items')[0];
   var cartItemNames=cartItems.getElementsByClassName('cart-item-title');
   for(var i=0;i<cartItemNames.length;i++)
   {
    if(cartItemNames[i].innerText==title)
    {
        alert('This item is already added to cart')
        return;
    }

   }
    var cartRowContents=`<div class="cart-item cart-column">
    <img  class="cart-item-img"src="${imgSrc} "alt="shirt" height="100px" />   
    <span class="cart-item-title">${title}</span>
  </div>
    <span class="cart-price  cart-column">${price}</span>
  <div class="cart-quant  cart-column">
    <input class="cart-quant-ip" type="number" value="1" >
    <button class="btn btn-danger" type="button">Remove</button>
  </div>`;
  cartRow.innerHTML=cartRowContents;
  cartItems.append(cartRow);
 
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeCartItem);
cartRow.getElementsByClassName('cart-quant-ip')[0].addEventListener('change',quantityChange);
}

function quantityChange(event)
{
    let input=event.target;
    if(isNaN(input.value)|| input.value<=0)
    input.value=1;
updateCartTotal();
}

function removeCartItem(event){
    let buttonClicked=event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    }



function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')    
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quant-ip')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}



