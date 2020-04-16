var Storage = require("../LocalStorage");
var Templates = require("../Templates");

var Cart = [];
var $cart = $("#cart");

function initializeCart() {
    var cart = Storage.get("cart");
    if(cart) Cart = cart;

    Storage.set("cart", Cart);
    $cart.html("");
    var totprice = 0;

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        totprice = totprice + cart_item.pizza[cart_item.size].price*cart_item.quantity;

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    $(".total-price").text(totprice +" грн");
    $("#pizzaNumber").text(Cart.length);
}

function getCartItems() {
    return Cart;
}

var $name = $("#i-name");
var $phone = $("#i-phone");
var $address = $("#i-address");

var $nameLabel = $("#label-name");
var $phoneLabel = $("#label-phone");
var $addressLabel = $("#label-address");

var NAME_REGEX = /^([А-я]|[І,і,Ї,ї,Є,є]){3,12}\s([А-я]|[І,і,Ї,ї,Є,є]){2,16}$/;
var PHONE_REGEX = /^(\+38)?0[3-9]\d\d{7}$/;
var ADDRESS_REGEX = /[\s\S]{10,50}/;

function initializeValidators() {
    initializeValidator($name, NAME_REGEX, $nameLabel);
    initializeValidator($phone, PHONE_REGEX, $phoneLabel);
    initializeValidator($address, ADDRESS_REGEX, $addressLabel);
}

function initializeValidator(input, regex, label) {
    input.focusout(() => {
        validate();
    });

    function validate() {
        if (!regex.test(input.val().trim())) {
            input.removeClass("success");
            input.addClass("fail");
            label.removeClass("success");
            label.addClass("fail");
        } else {
            input.removeClass("fail");
            input.addClass("success");
            label.removeClass("fail");
            label.addClass("success");
        }
    }

    validate();
}

function isValid() {
    return (
        !$name.hasClass("fail") &&
        !$phone.hasClass("fail") &&
        !$address.hasClass("fail")
    );
}

function getFormData() {
    return {
        name: $name.val().trim(),
        phone: $phone.val(),
        address: $address.val().trim()
    };
}

$(document).ready(() => {
    var API = require("../API");

    initializeCart();
    if (!getCartItems() || getCartItems().length == 0) {
        alert("Корзина порожня!");
        window.location.href = "/";
    }

    $("#next").click(function() {
        initializeValidators();
        if (isValid()) {
            var data = { 
                customerData: getFormData(), 
                cart: getCartItems() 
            };
            API.createOrder( data,
                () => {
                    console.log(data);
                    alert("Order sent!");
                }
            );
        }
    });
});