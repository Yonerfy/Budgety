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

    var calculateTotal =  function (type) {
       var sum = 0;
       data.allItems[type].forEach(function (cur) {
           sum += cur.value;
       }); 
       data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        porcentage: -1
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

        calculateBudget: function () {
            
            //Calculate the total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income that we spent

            if (data.totals.inc > 0) {
                data.porcentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.porcentage = -1;
            }

             

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                porcentage: data.porcentage
            }  
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
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function () {
            return {
                 type : document.querySelector(DOMstring.inputType).value,// Will be either inc or exp
                 description : document.querySelector(DOMstring.inputDescription).value,
                 value : parseFloat (document.querySelector(DOMstring.inputValue).value)
            };
            
        },

        addListItem: function (obj, type) {
            // Create HTML string with placeholder text
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstring.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstring.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data 

            newHtml = html.replace('%ide%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert the HTML into de DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearfields: function () {
            var fields, fieldArr;
            fields = document.querySelectorAll(DOMstring.inputDescription + ', ' + DOMstring.inputValue);
            fieldArr = Array.prototype.slice.call(fields);
            fieldArr.forEach(function (current, index, arry) {
                current.value = "";
            });
            fieldArr[0].focus();
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

    var updateBudget = function () {
        // 1. Calcule the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI 
        console.log(budget);
    }

    var ctrlAdditem = function () {
        var input, newItem;
        // 1. Get the field imput data
        input = UIctrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
                // 2. Add the item to the budget controller
            newItem =  budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UIctrl.addListItem(newItem, input.type);
            //4. Clear the field
            UIctrl.clearfields();
        
            // Calculate and update budget
            updateBudget();
        }
       
    };

    return {
        init: function () {
            console.log('Aplication has started.');
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();
