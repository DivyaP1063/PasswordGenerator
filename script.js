const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={[}]|":;/<,>.?';
let password="";
let passwordlength=10;
let checkcount=0;
handleSlider();
function handleSlider(){
    inputSlider.value=passwordlength;
    lengthDisplay.innerText=passwordlength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min) * 100 / (max - min)) + "% 100%";
}

setIndicator("#ccc");

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRandInt(min,max){
    return Math.floor(Math.random()* (max-min))+min;
}

function generateLowercase(){
    return String.fromCharCode(getRandInt(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandInt(65,91));
}

function generaterandNumber(){
    return getRandInt(0,9);
}

function generaterandSymbol(){
    let randIndex=getRandInt(0,symbols.length);
    return symbols.charAt(randIndex);
}

function shufflePasword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp= array[i];
        array[i]=array[j];
        array[i]=temp;
    }

    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordlength>=8) setIndicator("#0f0");
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordlength>=6) setIndicator("#ff0");
    else setIndicator("#f00");
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    } catch (e) {
        copyMsg.innerText="failed";
    }

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',(e)=>{
    if(passwordDisplay.value) copyContent();
})

function handleCheckbox(){
    checkcount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked) checkcount++;
    })

    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckbox);
})

generateBtn.addEventListener('click',()=>{
    if(checkcount<=0) return;

    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }

    password="";

    let FunArr=[];

    if(uppercaseCheck.checked) FunArr.push(generateUppercase);
    if(lowercaseCheck.checked) FunArr.push(generateLowercase);
    if(numbersCheck.checked) FunArr.push(generaterandNumber);
    if(symbolsCheck.checked) FunArr.push(generaterandSymbol);

    for(let i=0;i<FunArr.length;i++){
        password+=FunArr[i]();
    }

    for(let i=0;i<passwordlength-FunArr.length;i++){
        let ranind=getRandInt(0,FunArr.length);
        password+=FunArr[ranind]();
    }

    password=shufflePasword(Array.from(password));
    console.log(password);
    passwordDisplay.value=password;
    passwordDisplay.style.color = "white";

    calcStrength();
        
})