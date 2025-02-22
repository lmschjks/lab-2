const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// получение списка данных
app.get("/api/users", (req, res) => {
    const content = fs.readFileSync("users.json", "utf8");
    const users = JSON.parse(content);
    res.json({ success: true, message: users });
});

// получение одного пользователя по id
app.get("/api/users/:id", (req, res) => {
    const id = req.params.id; // получаем id
    const content = fs.readFileSync("users.json", "utf8");
    const users = JSON.parse(content);
    let user = null;
// находим в массиве пользователя по id
for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
        user = users[i];
        console.log("🚀 ~ app.get ~ user:", user);
        break;
    }
}

// отправляем пользователя
if (user) {
    res.json({ success: true, message: user });
} else {
    res.status(404).json({ success: false, message: "" });
}
});



// получение отправленных данных
app.post("/api/users", (req, res) => {
    // Обработка POST-запроса по маршруту "/api/users".
    const { name, age } = req.body;
    // Извлекаем значения `name` и `age` из тела запроса `req.body`.
    if (name == null || age == null) {
        // Проверяем, переданы ли `name` и `age`. Если одно из них равно `null` или
        //не передано:
        res.status(404).json({ success: false, message: "Данные не заполнены" });
        // Возвращаем статус 404 с JSON-ответом, указывающим на ошибку и сообщение
        //"Данные не заполнены".
    }
    const data = fs.readFileSync("users.json", "utf8");
    // Читаем файл "users.json" синхронно и сохраняем содержимое в переменную
    //`data` в виде строки.
    const users = JSON.parse(data);
    // Парсим JSON-строку `data` в массив объектов `users`.
    let user = { name, age };
    // Создаём объект `user` с полями `name` и `age`. Здесь должно быть { name,
    //age }
    // находим максимальный id
    const id = Math.max.apply(
        Math,
        users.map((o) => {
            // Используем метод `map` для создания массива всех id пользователей.
            return o.id;
            // Возвращаем id каждого пользователя.
        }),
    );
    // Находим максимальное значение id в массиве пользователей с помощью
    //`Math.max` и `apply`.
    // увеличиваем его на единицу
    user.id = id + 1;
    // Присваиваем новому пользователю id, увеличенное на 1 от максимального id в
    // массиве.
        // добавляем пользователя в массив

        users.push(user);
    // Добавляем нового пользователя в массив `users`.
    const newData = JSON.stringify(users);
    // Подготовка данных для записи: преобразование массива пользователей обратно в
    //строку JSON.
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", newData);
    // Записываем обновлённые данные обратно в файл "users.json". В `newData`
    // должна быть строка, подготовленная на основе массива `users`.
    res.json({ success: true, message: user });
    // Отправляем JSON-ответ с подтверждением успешного добавления пользователя и
    // возвращаем объект пользователя.
});

// удаление пользователя по id
app.delete("/api/users/:id", (req, res) => {
    // Обработка DELETE-запроса по маршруту "/api/users/:id", где `:id` —
    // параметр, представляющий id пользователя.
    const id = req.params.id;
    // Извлекаем значение id из параметров URL-запроса и сохраняем его в переменную
    // `id`.
    if (id == null || id == "") {
        // Проверяем, передан ли id и не является ли он пустым.
        res.status(404).json({ success: false, message: "Данные не заполнены" });
        // Если id не передан или пуст, возвращаем статус 404 с JSON-ответом и
        // сообщением "Данные не заполнены".
    }
    const data = fs.readFileSync("users.json", "utf8");
    // Читаем содержимое файла "users.json" синхронно и сохраняем его в
    // переменную `data` в виде строки.
    const users = JSON.parse(data);
    // Парсим JSON-строку `data` в массив объектов `users`.
    let index = -1;

    // Инициализируем переменную `index` со значением -1 для хранения индекса
    // пользователя, если он будет найден.
    // находим индекс пользователя в массиве
    for (let i = 0; i < users.length; i++) {
        // Перебираем массив пользователей `users`.
        if (users[i].id == id) {
            // Сравниваем id текущего пользователя с переданным id.
            index = i;
            // Если id совпадает, сохраняем индекс этого пользователя в переменную
            // `index`.
            break;
            // Прерываем цикл, так как нужный пользователь найден.
        }
    }
    if (index > -1) {
        // Проверяем, был ли найден пользователь: если `index` больше -1, значит,
        // пользователь найден.
        // удаляем пользователя из массива по индексу
        const user = users.splice(index, 1)[0];
        // Удаляем пользователя из массива `users` по найденному индексу `index` и
        // сохраняем удалённого пользователя в переменную `user`.
        const data = JSON.stringify(users);
        // Преобразуем обновлённый массив `users` обратно в JSON-строку для записи в
        // файл.
        fs.writeFileSync("users.json", data);
        // Записываем обновлённые данные обратно в файл "users.json".
        // отправляем удаленного пользователя
        res.json({ success: true, message: user });
        // Возвращаем JSON-ответ с подтверждением успешного удаления и данными
        // удалённого пользователя.
    } else {
        // Если `index` не изменился и остался -1, значит, пользователь с указанным
        // id не найден.
        res.status(404).json({ success: false, message: "Ошибка записи" });
        // Возвращаем статус 404 с сообщением "Ошибка записи", указывающим, что
        // удаление не удалось.
    }
});

// изменение пользователя
app.put("/api/users", (req, res) => {
    // Обработка PUT-запроса по маршруту "/api/users" для обновления данных
    // пользователя.
    const { name, age, id } = req.body;
    // Извлекаем значения `name`, `age` и `id` из тела запроса.
    if (name == null || age == null || id == null) {
        // Проверяем, переданы ли `name`, `age` и `id`. Если одно из них равно
        // `null` или не передано:
        res.status(404).json({ success: false, message: "Данные не заполнены" });
        // Возвращаем статус 404 с JSON-ответом и сообщением "Данные не заполнены".
    }
    const data = fs.readFileSync("users.json", "utf8");
    // Читаем содержимое файла "users.json" синхронно и сохраняем его в
    // переменную `data` в виде строки.
    const users = JSON.parse(data);
    // Парсим JSON-строку `data` в массив объектов `users`.
    let user;
    // Инициализируем переменную `user`, которая будет хранить найденного
    // пользователя.
    for (let i = 0; i < users.length; i++) {
        // Перебираем массив пользователей `users`.
        if (users[i].id == id) {
            // Сравниваем id текущего пользователя с переданным id.
            user = users[i];
            // Если id совпадает, сохраняем объект пользователя в переменную `user`.
            break;
            // Прерываем цикл, так как нужный пользователь найден.
        }
    }
    // изменяем данные у пользователя
    if (user) {
        // Проверяем, найден ли пользователь: если переменная `user` определена,
        // значит, пользователь найден.
        user.age = age;
        // Обновляем значение `age` у найденного пользователя.
        user.name = name;
        // Обновляем значение `name` у найденного пользователя.
        const newData = JSON.stringify(users);
        // Преобразуем обновлённый массив `users` обратно в JSON-строку для записи в
        // файл.

        fs.writeFileSync("users.json", newData);
        // Записываем обновлённые данные обратно в файл "users.json".
        res.json({ success: true, message: user });
        // Возвращаем JSON-ответ с подтверждением успешного обновления и данными
        // обновлённого пользователя.
    } else {
        // Если пользователь с указанным id не найден (переменная `user` не
        // определена):
        res.status(404).json({ success: false, message: "Ошибка записи" });
        // Возвращаем статус 404 с сообщением "Ошибка записи", указывающим, что
        // обновление не удалось.
    }
});

app.listen(3000, () => {
    console.log("Сервер ожидает подключения на http://localhost:3000");
});