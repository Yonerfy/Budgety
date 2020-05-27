//BUDGET CONTROLLER
var budgetController = (function () {
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            // create a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1 ;
            } else {
                ID = 0;
            }
            
            //Create a new item base on 'inc' of 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val) 
                 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }
            //Push it intro our data structure
            data.allItems[type].push(newItem);
            //Return de new element
            return newItem;
        },

        testing: function () {
            console.log(data);
        }
    };

    
})();



//UICONTROLLER
var UIController = (function () {
    
    var DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn : '.add__btn' 
    };

    return {
        getInput: function () {
            return {
                 type : document.querySelector(DOMstring.inputType).value,// Will be either inc or exp
                 description : document.querySelector(DOMstring.inputDescription).value,
                 value : document.querySelector(DOMstring.inputValue).value
            };
            
        },
        getDOMstring: function () {
            return DOMstring;
        }
    }

})();



//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UIctrl) {

    setupEventListeners = function () {
        var DOM = UIctrl.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAdditem);
        document.addEventListener('keypress',function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAdditem();
            }
        });
    };


    var ctrlAdditem = function () {
        var input, newItem;
        // 1. Get the field imput data
        input = UIctrl.getInput();
        // 2. Add the item to the budget controller
        newItem =  budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log(input);
    };

    return {
        init: function () {
            console.log('Aplication has started.');
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();
