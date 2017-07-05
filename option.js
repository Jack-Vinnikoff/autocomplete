
var json = [];  //Массив с преобразованным JSON файлом
var selectedHint = []; // Массив в котором хранятся подсказки (слова для автозаполнения)
var object = {}; // Объект для удобства, чтобы выделить буквы которые совпали в поле ввода с полем подсказок
var input = document.getElementById('county'); // Поле для ввода страны
var elem = document.getElementById('test');
//--------------------------------------------------------------------

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

readTextFile("names.json", function(text){
    var data = JSON.parse(text);
    for (key in data){
        json.push(data[key])
    }
    json.sort();
    console.log(json);
});
//Здесь мы парсим JSON файл и приобразовываем его в массив
//------------------------------------------------------------------




oninput = function () {
    var newHint = []; // Временный массив в котором сохраняются наши подсказки (автозаполнение)
    var inputValue = input.value; // Данная переменная создана для удобства брать значения нашего поля ввода
    var key, textValue;
    //-------------------------------------

    // Создана специально задержка ( сейчас она равна 0 миллисекунд )
    setTimeout(function () {
        for (var i = 0; i < json.length; i++) {
            var find = json[i].toLowerCase().indexOf(inputValue.toLowerCase()); //Ищем на совпадение слова (буквы)
            if (find == 0 && inputValue.length != 0) {
                var word = json[i];
                newHint.push(word); // Если условие правильно то добавляем элемент массива Json в массив подсказок
                key = json[i].substr(0, inputValue.length);
                textValue = json[i].substr(inputValue.length);
                object[word] = {'key': key, 'value': textValue};
            }
            //-------------------------------
            //Условие проверки пустого поля, если поле пустое, то выводим все значения массива json
            if (inputValue.length == 0){
                newHint = json;
            }
            //------------------------------
        }
        selectedHint = newHint; //Здесь мы присваиваем значение локальной переменной в глобальную, для удобства работы с функциями
        console.log(selectedHint);
        showHint(); // Вызываем функцию которая выводит подсказки (автозаполнение) на страницу
        check(); // Проверяем поле, если совпадений нет то границы поля становятся красного цвета
    }, 0);

};
//-----------------------------------------------------------

function showHint() {
    //-------------------------------------
    // Проверка чтоб в поле подсказок выводилось не больше 5 элементов
    if (input.value.length != 0){
        if (selectedHint.length > 5) {
            selectedHint.length = 5;
        }
    }

    else{
        object = {};
    }
    //---------------------------------------

    elem.innerHTML = ''; // Здесь мы очищаем поле подсказок
    //---------------------------------------
    // Цикл в котором мы выводим по очереди все подсказки в поле подсказок
    for (var y = 0; y < selectedHint.length; y++) {
        var word = selectedHint[y];
        console.log(object.length);
        var spanData = object[word] ? '<span>' + object[word]['key']  +'</span>'+ object[word]['value'] : word;
        elem.innerHTML += '<div class="hint" data-value="' + word + '"  onclick="applyChecked(this)">'+ spanData +'</div>'
    }
    elem.style.display = 'block';
}
//--------------------------------------------------------


function check() {
    var checkInput = document.forms.autocomplete.elements.county;
    if (selectedHint.length == 0) {
        checkInput.style.borderColor = 'red'; //подчеркиваем красным цветом, если нет совпадений
        return elem.innerHTML ='<div class="nores">'+'Нет результатов'+'</div>'; // выводим в поле подсказок сообщение, если совпадений не было

    }
    return checkInput.style.borderColor = 'green';
}

function applyChecked(element) {
    var checkInput = document.forms.autocomplete.elements.county;
    checkInput.value = element.getAttribute('data-value');
    selectedHint = [];
    showHint();
    elem.style.display = 'none'; // Убираем поле подсказок
    alert('Вы выбрали '+ element.getAttribute('data-value')); // Выводим наш выбор через Alert
}