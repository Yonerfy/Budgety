//BUDGET CONTROLLER
var budgetController = (function () {
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.porcentage = -1;
    };

    Expense.prototype.calcPorcentege = function (totalIncome) {
        if ( totalIncome > 0 ) {
            this.porcentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.porcentage = -1;
        }
        
    };

    Expense.prototype.getPorcentage = function () {
        return this.porcentage;
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

        deleteItem : function (type, id) {
            var ids, index;
            // id = 6
            // data.allItems[type][id]
            // ids = [2,3,4,5,6]
            // index = 3
            ids = data.allItems[type].map(function (current) {
               return current.id;     
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePorcentages : function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPorcentege(data.totals.inc);
            })
        },

        getPorcentages : function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPorcentage();
            });
            return allPerc;  
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        porcentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPorcLabel: '.item__percentage'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;
        // + or - before number
        // exalty two decimal points
        // comma separating the thousands

        //2310.4567  -> + 2,310.46

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
        }

        dec = numSplit[1];

        

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int  + '.' + dec;

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstring.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data 

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            //Insert the HTML into de DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
           var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);
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

        displayBudget: function (obj) {
            document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;  
            document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;  
            document.querySelector(DOMstring.expenseLabel).textContent = obj.totalExp;  
             

            if (obj.porcentage > 0) {
                document.querySelector(DOMstring.porcentageLabel).textContent = obj.porcentage + '%'; 
            } else {
                document.querySelector(DOMstring.porcentageLabel).textContent = '---'; 
            }
        },

        displayPorcentages : function ( percentages) {
           var field = document.querySelectorAll(DOMstring.expensesPorcLabel);
           
           var nodeListForEach = function (list, callback) {
               for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
               }
           };

           nodeListForEach(field, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
               
           });
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function () {
        // 1. Calcule the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI 
        UIctrl.displayBudget(budget)
    };

    var updatePorcetages = function () {
        // 1. Calculate the porcetages
        budgetCtrl.calculatePorcentages();
        // 2. Read porcentages for the budget controller
        var porcentages = budgetCtrl.getPorcentages();  
        // 3. Update the UI with the new porcentage
        UIctrl.displayPorcentages(porcentages);
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
        
            //5. Calculate and update budget
            updateBudget();

            //6. Calculate and update porcentages
            updatePorcetages();
        }
       
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1.Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2.Delete de item from the UI
            UIctrl.deleteListItem(itemID);
            // 3.Udate and show the new budget
            updateBudget();
            // 4. Calculate and update porcentages
            updatePorcetages();
        }
    }

    return {
        init: function () {
            console.log('Aplication has started.');
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                porcentage: -1
            })
            setupEventListeners();

        }
    }
    
})(budgetController, UIController);

controller.init();
