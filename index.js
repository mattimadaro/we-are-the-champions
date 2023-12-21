//Initial database setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-3c3bb-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementList")

//Variable declaration
const inputFieldEl = document.getElementById("endorsement-input")
const fromInputFieldEl = document.getElementById("from-el")
const toInputFieldEl = document.getElementById("to-el")
const addButtonEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")

addButtonEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value
    let fromInputValue = fromInputFieldEl.value
    let toInputValue = toInputFieldEl.value
    let inputs = {
        endorsement: inputValue,
        personFrom: fromInputValue,
        personTo: toInputValue
    }
    
    push(endorsementsInDB, inputs)
    
    clearInputFieldsEl()

})

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        itemsArray.reverse()
        
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemEndorsement = currentItem[1].endorsement
            let currentItemFrom = currentItem[1].personFrom
            let currentItemTo = currentItem[1].personTo
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        endorsementListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    endorsementListEl.innerHTML = ""
}

function clearInputFieldsEl() {
    inputFieldEl.value = ""
    fromInputFieldEl.value = ""
    toInputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemEndorsement = item[1].endorsement
    let itemFrom = item[1].personFrom
    let itemTo = item[1].personTo
  
       
    let newEl = document.createElement("li")
    
    newEl.innerHTML = `
        <p style="font-weight: bold;">To ${itemTo}</p> 
        ${itemEndorsement}
        <p style="font-weight: bold;">From ${itemFrom}</p>
    `
   
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementListEl.append(newEl)
}
