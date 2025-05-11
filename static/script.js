
const user_id = 6;
let userData = { score: 0, mood: 0, money: 0 };

console.log("hi");

async function fetchData(endpoint, listElementId) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("no network");

        let data = await response.json();
        data.reverse();
        const listElement = document.getElementById(listElementId);
        data.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = JSON.stringify(item);
            listElement.appendChild(listItem);
        });

    } catch (error) {
        console.error("error fetching data", error);Ф
    }
}

async function fetchTasks(endpoint, listElementId) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        const listElement = document.getElementById(listElementId);
        if (!listElement) {
            console.error(`Element with id '${listElementId}' not found.`);
            return;
        }
        listElement.innerHTML = "";

        const taskCountTextDiv = document.createElement("div");
        taskCountTextDiv.className = "task-header";
        taskCountTextDiv.textContent = "Актуальные задачи:";
        listElement.appendChild(taskCountTextDiv);

        const incompleteTasksContainer = document.createElement("div");
        incompleteTasksContainer.className = "task-container";
        listElement.appendChild(incompleteTasksContainer);

        const completedLabelTextDiv = document.createElement("div");
        completedLabelTextDiv.className = "task-header-";
        completedLabelTextDiv.textContent = "Выполненные задачи";
        listElement.appendChild(completedLabelTextDiv);

        const completedTasksContainer = document.createElement("div");
        completedTasksContainer.className = "task-container";
        listElement.appendChild(completedTasksContainer);

        data.forEach((item) => {
            // Используем правильное имя поля для идентификатора
            const taskId = item.id || item.task_id;  // Попробуйте оба варианта
            if (!taskId) {
                console.error("Task ID is missing for item:", item);
                return;
            }

            const className = item.is_done ? "activities-task-negative" : "activities-task";
            const checkClass = item.is_done ? "activities-checkBox-greenMark" : "activities-checkBox-";

            const block = document.createElement("div");
            block.className = "task-block";
            block.innerHTML = `
            <div class="${className} roboto-bold" style="display: flex; justify-content: space-between; width: 100%;">
                <div>${item.name}</div>
                <div class="activities-check ml-auto">
                    <div class="${checkClass}" data-id="${taskId}" data-type="task" data-checked="${item.is_done}"></div>
                </div>
            </div>
            `;

            if (item.is_done) {
                completedTasksContainer.appendChild(block);
            } else {
                incompleteTasksContainer.appendChild(block);
            }
        });

        updateTaskAndLabelVisibility(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
        addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}



async function fetchDailies(endpoint, listElementId) {
    try {
        console.log(`Fetching dailies from ${endpoint}`);
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const listElement = document.getElementById(listElementId);
        if (!listElement) {
            console.error(`Element with id '${listElementId}' not found.`);
            return;
        }
        listElement.innerHTML = "";

        const taskCountTextDiv = document.createElement("div");
        taskCountTextDiv.className = "task-header";
        taskCountTextDiv.textContent = "Актуальные дейлики:";
        listElement.appendChild(taskCountTextDiv);

        const incompleteTasksContainer = document.createElement("div");
        incompleteTasksContainer.className = "task-container";
        listElement.appendChild(incompleteTasksContainer);

        const completedLabelTextDiv = document.createElement("div");
        completedLabelTextDiv.className = "task-header";
        completedLabelTextDiv.textContent = "Выполненные дейлики:";
        listElement.appendChild(completedLabelTextDiv);

        const completedTasksContainer = document.createElement("div");
        completedTasksContainer.className = "task-container";
        listElement.appendChild(completedTasksContainer);

        console.log("Creating daily items...");
        data.forEach((item) => {
            const taskId = item.id || item.daily_id; // Используем аналогичное имя поля для идентификатора
            if (!taskId) {
                console.error("Daily ID is missing for item:", item);
                return;
            }

            const className = item.is_done ? "activities-task-negative" : "activities-task";
            const checkClass = item.is_done ? "activities-checkBox-greenMark" : "activities-checkBox-";

            const block = document.createElement("div");
            block.className = "task-block";
            block.innerHTML = `
                <div class="${className} roboto-bold" style="display: flex; justify-content: space-between; width: 100%;">
                    <div>${item.name}</div>
                    <div class="activities-check ml-auto">
                        <div class="${checkClass}" data-id="${taskId}" data-type="dailies" data-checked="${item.is_done}"></div>
                    </div>
                </div>
            `;

            if (item.is_done) {
                completedTasksContainer.appendChild(block);
            } else {
                incompleteTasksContainer.appendChild(block);
            }
        });

        console.log("Dailies loaded, adding event listeners...");
        addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv) {
    console.log('addCheckboxEventListeners called');
    document.querySelectorAll(".activities-checkBox, .activities-checkBox-negative, .activities-checkBox-greenMark").forEach((box, index) => {
        console.log(`Adding event listener to checkbox ${index}`);
        box.addEventListener("click", async function () {
            const isChecked = this.dataset.checked === "true";
            const type = this.dataset.type;

            console.log(`Checkbox clicked: type=${type}, isChecked=${isChecked}`);

            if (type === "dailies" || type === "task") {
                const newCheckedState = !isChecked;
                this.dataset.checked = newCheckedState.toString();

                const itemElement = this.parentElement.parentElement;

                if (newCheckedState) {
                    itemElement.classList.replace("activities-task", "activities-task-negative");
                    this.classList.replace("activities-checkBox-", "activities-checkBox-greenMark");
                    completedTasksContainer.appendChild(itemElement);
                } else {
                    itemElement.classList.replace("activities-task-negative", "activities-task");
                    this.classList.replace("activities-checkBox-greenMark", "activities-checkBox-");
                    incompleteTasksContainer.appendChild(itemElement);
                }

                // Обновление состояния на сервере
                try {
                    const itemId = this.dataset.id;
                    console.log(`Updating item with ID: ${itemId}`);
                    const endpoint = type === "dailies" ? `/dailies/${itemId}/toggle` : `/tasks/${itemId}/toggle`;

                    await fetch(endpoint, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ is_done: newCheckedState })
                    });
                } catch (error) {
                    console.error(`Error updating ${type} state`, error);
                }

                updateTaskAndLabelVisibility(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
            }
        });
    });
}

function updateTaskAndLabelVisibility(incompleteContainer, completeContainer, taskCountTextDiv, completedLabelTextDiv) {
    taskCountTextDiv.style.display = incompleteContainer.children.length > 0 ? 'block' : 'none';
    completedLabelTextDiv.style.display = completeContainer.children.length > 0 ? 'block' : 'none';
}


async function fetchHabities(endpoint, listElementId) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const listElement = document.getElementById(listElementId);
        if (!listElement) {
            console.error(`Element with id '${listElementId}' not found.`);
            return;
        }
        listElement.innerHTML = ""; // Очищаем содержимое списка

        // Отображаем количество привычек
        const completedLabelTextDiv = document.createElement("div");
        completedLabelTextDiv.className = "task-header";
        completedLabelTextDiv.textContent = `Количество привычек: ${data.length}`;
        listElement.appendChild(completedLabelTextDiv);

        data.forEach((item) => {
            const block = document.createElement("div");
            const checkClass = item.is_positive ? "activities-checkBox green" : "activities-checkBox-negative";

            // Создаём блок для привычки
            block.innerHTML = item.is_positive
                ? `<div class="activities-task roboto-bold">
                     <div>${item.name}</div>
                     <div class="activities-check ml-auto">
                         <div class="${checkClass}" data-id="${item.id}" data-type="habit" data-positive="true" data-times="${item.times}">
                             <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
                         </div>
                     </div>
                   </div>`
                : `<div class="activities-task-negative roboto-bold">
                     <div class="activities-check">
                         <div class="${checkClass}" data-id="${item.id}" data-type="habit" data-positive="false" data-times="${item.times}">
                             <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
                         </div>
                     </div>
                     <div class="ml-auto">${item.name}</div>
                   </div>`;

            listElement.appendChild(block);
        });

        // Добавляем обработчики событий для чекбоксов
        addCheckboxEventListenersForHabits();

    } catch (error) {
        console.error("Error fetching habits data:", error);
    }
}

function addCheckboxEventListenersForHabits() {
    // Ищем все чекбоксы для привычек и добавляем обработчики событий
    document.querySelectorAll(".activities-checkBox, .activities-checkBox-negative").forEach((box) => {
        box.addEventListener("click", async function () {
            const habitId = this.dataset.id;
            let times = parseInt(this.dataset.times, 10);

            console.log(`Checkbox clicked: habitId=${habitId}, times=${times}`);

            // Инкрементируем количество выполнений привычки
            this.dataset.times = ++times;
            const textElement = this.querySelector(".z-index-99");
            if (textElement) {
                textElement.innerText = times;
            }

            const isPositive = this.dataset.positive === "true";
            console.log(`Incrementing habit: isPositive=${isPositive}, times=${times}`);

            if (isPositive) {
                userData.mood = Math.min(100, userData.mood + 5);
                userData.money = Math.max(0, userData.money + 3);
                userData.score += 10;
            } else {
                userData.mood = Math.max(0, userData.mood - 5);
                userData.money = Math.max(0, userData.money - 3);
                userData.score += 2;
            }

            try {
                const response = await fetch(`/habits/${habitId}/increment_times`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to increment habit times: ${response.statusText}`);
                }

                const updatedHabit = await response.json();
                console.log(`Habit ${updatedHabit.habit_id} times incremented to ${updatedHabit.times}`);
            } catch (error) {
                console.error('Error incrementing habit times:', error);
            }

            updateUserInfo();
        });
    });
}


async function fetchUser(user_id) {
    try {
        const response = await fetch(`/users/${user_id}`);
        if (!response.ok) throw new Error("Ошибка сети");

        const data = await response.json();
        userData = {
            score: data.score || 0,
            mood: data.mood || 0,
            money: data.money || 0,
            level_id: data.level_id || 0
        };

        updateUserInfo();
    } catch (error) {
        console.error("Ошибка при получении данных", error);
    }
}

async function updateUserInfo() {
    try {
        const levelResponse = await fetch(`/levels/${userData.level_id + 1}`);
        if (!levelResponse.ok) throw new Error("Ошибка сети");

        const levelData = await levelResponse.json();
        const level_top = levelData.level_top;

        const information_block = document.getElementById("user-info");
        let lvl_mood = Math.round((userData.mood - 1) / 25);
        const block = `
            <div class="informationBlock vert">
                <div class="level">
                    <div class="roboto-bold font-white">Уровень ${userData.level_id || "неизвестно"}</div>
                    <div class="level-bar">
                        <div style="width:${(userData.score / level_top) * 100}%;"
                             class="green-part light-green roboto-bold">${userData.score}</div>
                    </div>
                    <div class="inline">
                        <div class="roboto-bold font-white">0</div>
                        <div class="roboto-bold font-white ml-auto">${level_top}</div>
                    </div>
                </div>
                <div class="mood">
                    <div class="roboto-bold font-white">настроение:</div>
                    <div class="mood-bar">
                        <div class="roboto-bold font-white">${userData.mood}%</div>
                        <div class="level-mood-bar">
                            <div style="width:${userData.mood}%;"
                                 class="procent-mood level-mood-${lvl_mood} roboto-bold"></div>
                        </div>
                    </div>
                </div>
                <div class="coinline mt-10">
                    <div class="coin-icon baseline"></div>
                    <div class="roboto-bold font-white baseline">${userData.money}</div>
                </div>
            </div>`;
        information_block.innerHTML = block;
    } catch (error) {
        console.error("Ошибка при обновлении информации пользователя", error);
    }
}

function updateTaskAndLabelVisibility(incompleteContainer, completeContainer, taskCountTextDiv, completedLabelTextDiv) {
    taskCountTextDiv.style.display = incompleteContainer.children.length > 0 ? 'block' : 'none';
    completedLabelTextDiv.style.display = completeContainer.children.length > 0 ? 'block' : 'none';
}

function addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv) {
    document
        .querySelectorAll(
            ".activities-checkBox-, .activities-checkBox-negative, .activities-checkBox-greenMark"
        )
        .forEach((box) => {
            box.addEventListener("click", async function () {
                const isChecked = this.dataset.checked === "true";
                const type = this.dataset.type;

                if (type === "task") {
                    // Переключение состояния задачи
                    const newCheckedState = !isChecked;
                    this.dataset.checked = newCheckedState;

                    const taskElement = this.parentElement.parentElement;
                    if (newCheckedState) {
                        // Пометить как выполненную
                        userData.money = Math.max(0, userData.money + 5);

                        if (userData.mood < 25) {
                            userData.mood = Math.min(100, userData.mood + 15);
                            userData.score += 10;
                        } else if (userData.mood < 50 && userData.mood >= 25) {
                            userData.mood = Math.min(100, userData.mood + 12);
                            userData.score += 12;
                        } else if (userData.mood < 75 && userData.mood >= 50) {
                            userData.mood = Math.min(100, userData.mood + 10);
                            userData.score += 15;
                        } else if (userData.mood >= 75) {
                            userData.mood = Math.min(100, userData.mood + 5);
                            userData.score += 15;
                        }

                        taskElement.classList.replace(
                            "activities-task",
                            "activities-task-negative"
                        );
                        this.classList.replace(
                            "activities-checkBox-",
                            "activities-checkBox-greenMark"
                        );

                        completedTasksContainer.appendChild(taskElement);
                    } else {
                        // Пометить как невыполненную
                        userData.money = Math.max(0, userData.money - 5);

                        taskElement.classList.replace(
                            "activities-task-negative",
                            "activities-task"
                        );
                        this.classList.replace(
                            "activities-checkBox-greenMark",
                            "activities-checkBox-"
                        );

                        incompleteTasksContainer.appendChild(taskElement);
                    }

                    // Обновление задачи на сервере
                    try {

                        const taskId = this.dataset.id;
                        console.log(`Updating task with ID: ${taskId}`);
                        await fetch(`/tasks/${taskId}/toggle`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ is_done: newCheckedState })
                        });
                    } catch (error) {
                        console.error('Error updating task state', error);
                    }

                    updateTaskAndLabelVisibility(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
                } else if (type === "habit") {
                    console.log("+times")
                    const isPositive = this.dataset.positive === "true";
                    let times = parseInt(this.dataset.times, 10);
                    this.dataset.times = ++times;
                    const textElement = this.querySelector(".z-index-99");
                    if (textElement) {
                        textElement.innerText = times;
                    }

                    if (isPositive) {
                        userData.mood = Math.min(100, userData.mood + 5);
                        userData.money = Math.max(0, userData.money + 3);
                        userData.score += 10;
                    } else {
                        userData.mood = Math.max(0, userData.mood - 5);
                        userData.money = Math.max(0, userData.money - 3);
                        userData.score += 2;
                    }
                }

                updateUserInfo();
            });
        });
}

async function incrementHabitTimes(habitId) {
    try {
        const response = await fetch(`/habits/${habitId}/increment_times`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error(`Failed to increment habit times: ${response.statusText}`);
        }

        const updatedHabit = await response.json();
        console.log(`Habit ${updatedHabit.habit_id} times incremented to ${updatedHabit.times}`);
    } catch (error) {
        console.error('Error incrementing habit times:', error);
    }
}



// Функция для загрузки данных пользователя
async function loadUserData(userId) {
    try {
        const response = await fetch(`/users/${userId}`);
        if (!response.ok) throw new Error("Ошибка сети при получении данных пользователя");

        const data = await response.json();
        userData = {
            score: data.score || 0,
            mood: data.mood || 0,
            money: data.money || 0,
            level_id: data.level_id || 0
        };

        console.log("Данные пользователя загружены:", userData);
    } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
    }
}

   async function updateUserStats(userId, statsData) {
       try {
           console.log("Отправка данных на сервер:", statsData);
           const response = await fetch(`/users/${userId}/stats`, {
               method: 'PATCH',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(statsData)
           });

           if (!response.ok) {
               const errorText = await response.text();
               throw new Error(`Ошибка при обновлении данных пользователя: ${response.status} - ${errorText}`);
           }

           const updatedUser = await response.json();
           console.log("Данные пользователя успешно обновлены:", updatedUser);
       } catch (error) {
           console.error("Ошибка при обновлении данных пользователя", error);
       }
   }
// Функция для обновления данных и сохранения изменений
function updateUserDataIfNeeded(userId) {
         updateUserStats(userId, userData);

}


fetchHabities(`/users/${user_id}/habbites`, "habbities-list");
fetchTasks(`/users/${user_id}/tasks`, "task-list");
fetchDailies(`/users/${user_id}/dailies`, "dailies-list");

document.addEventListener("DOMContentLoaded", () => {
    loadUserData(user_id); // Загрузка данных при старте

    // Устанавливаем интервал для обновления данных
    setInterval(() => {
        updateUserDataIfNeeded(userId);
    }, 2000);


    fetchHabities(`/users/${user_id}/habbites`, "habbities-list");
    fetchTasks(`/users/${user_id}/tasks`, "task-list");
    fetchDailies(`/users/${user_id}/dailies`, "dailies-list");

    const incompleteTasksContainer = document.getElementById("incomplete-tasks");
    const completedTasksContainer = document.getElementById("completed-tasks");
    const taskCountTextDiv = document.querySelector(".task-header");
    const completedLabelTextDiv = document.querySelector(".task-header-");

    addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);

    const information_block = document.getElementById("user-info");
    fetchUser(user_id, information_block);
    let menuType = 1;

    document.querySelectorAll(".menu .type-button, .menu .marker-button").forEach((item) => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".menu div").forEach((item) => item.classList.remove("active"));
            this.classList.add("active");

            document.querySelectorAll(".content-section").forEach((section) => {
                section.style.display = "none";
            });

            let targetContentId;
            const addActivities = document.querySelector('.add-activities');
            if (this.querySelector(".task-icon")) {
                targetContentId = "tasks-content";
                menuType = 1;
                addActivities.style.display = 'block';
            } else if (this.querySelector(".dayleak-icon")) {
                targetContentId = "dailies-content";
                menuType = 2;
                addActivities.style.display = 'none';
            } else if (this.querySelector(".habit-icon")) {
                targetContentId = "habits-content";
                menuType = 3;
                addActivities.style.display = 'block';
            } else if (this.querySelector(".settings-icon")) {
                targetContentId = "settings-content";
                menuType = 4;
                addActivities.style.display = 'none';
            }

            if (targetContentId) {
                const targetContent = document.getElementById(targetContentId);
                if (targetContent) {
                    targetContent.style.display = "block";
                } else {
                    console.error(`Целевая секция с ID ${targetContentId} не найдена`);
                }
            }
        });
    });

    const templates = {
        1: `<div class="horizontal-center roboto-regular">создать задачу</div>
            <form class="pd-15">
                <input placeholder="Введите текст" class="form-txt" type="text" name="name" id="name" required />
            </form>
            <div class="horizontal-center">
                <button class="button-confirm">Подтвердить</button>
                <button class="button-cancel">Отменить</button>
            </div>`,
        2: `<form class="pd-15">
                <input placeholder="Введите текст" class="form-txt" type="text" name="name" id="name" required />
            </form>
            <div class="horizontal-center">
                <button class="button-confirm">Подтвердить</button>
                <button class="button-cancel">Отменить</button>
            </div>`,
        3: `<div class="horizontal-center roboto-regular">создать привычку</div>
            <form class="pd-15">
                <input placeholder="Введите текст" class="form-txt" type="text" name="name" id="name" required />
            </form>
            <div class="horizontal-center">
                <button class="button-or">положительная</button>
                <button class="button-or1">негативная</button>
            </div>
            <div class="horizontal-center">
                <button class="button-confirm">Подтвердить</button>
                <button class="button-cancel">Отменить</button>
            </div>`
    };

    const createTask = document.querySelector('.create-task');
    const addActivities = document.querySelector('.add-activities');

    if (addActivities) {
        addActivities.addEventListener('click', function () {
            this.classList.toggle('rotated');
            if (this.classList.contains('rotated')) {
                createTask.style.display = 'block';
                if (templates[menuType]) {
                    createTask.innerHTML = templates[menuType];
                    const positiveButton = createTask.querySelector('.button-or');
                    const negativeButton = createTask.querySelector('.button-or1');

                    function toggleActive() {
                        this.classList.add('active');
                        if (this === positiveButton) {
                            negativeButton.classList.remove('active');
                        } else {
                            positiveButton.classList.remove('active');
                        }
                    }

                    if (positiveButton && negativeButton) {
                        positiveButton.addEventListener('click', toggleActive);
                        negativeButton.addEventListener('click', toggleActive);
                        positiveButton.classList.add('active');
                    }

                    const confirmButton = createTask.querySelector('.button-confirm');
                    if (confirmButton) {
                        confirmButton.addEventListener('click', async function () {
                            const input = createTask.querySelector('input');
                            if (input && input.value.trim() !== '') {
                                const isPositive = positiveButton ? positiveButton.classList.contains('active') : false;
                                await addNewItem(input.value.trim(), menuType, isPositive);
                                input.value = '';
                                createTask.style.display = 'none'; // Hide menu
                                addActivities.classList.remove('rotated');
                            }



                        });
                    } else {
                        console.error('Confirm button not found');
                    }

                    const cancelButton = createTask.querySelector('.button-cancel');
                    if (cancelButton) {
                        cancelButton.addEventListener('click', function () {
                            createTask.style.display = 'none'; // Hide menu
                            addActivities.classList.remove('rotated');
                        });
                    }

                } else {
                    createTask.innerHTML = `<div>Ошибка: шаблон не найден для значения ${menuType}.</div>`;
                }
            } else {
                createTask.style.display = 'none';
            }
        });
    }

async function addNewItem(name, type, isPositive) {
    if (type === 1) { // Task
        const task = {
            name: name,
            is_done: false,
            user_id: user_id
        };

        try {
            const response = await fetch(`/users/${user_id}/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сети при сохранении: ${response.status} - ${errorText}`);
            }
            fetchTasks(`/users/${user_id}/tasks`, "task-list"); // Обновление списка задач

        } catch (error) {
            console.error('Ошибка при сохранении задачи', error);
        }
    } else if (type === 3) { // Habit
        const habit = {
            name: name,
            is_positive: isPositive,
            user_id: user_id
        };

        console.log('Attempting to save habit:', habit);

        try {
            const response = await fetch(`/users/${user_id}/habit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(habit)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network error while saving: ${response.status} - ${errorText}`);
            }
            fetchHabities(`/users/${user_id}/habbites`, "habbities-list"); // Обновление списка привычек

        } catch (error) {
            console.error('Error saving habit', error);
        }
    }
}
function addCheckboxEventListeners() {
    console.log("Adding event listeners to checkboxes");
    document.querySelectorAll(".activities-checkBox, .activities-checkBox-negative, .activities-checkBox-greenMark").forEach((box) => {
        box.addEventListener("click", async function () {
            const type = this.dataset.type;
            const habitId = this.dataset.id;
            console.log(`Checkbox clicked: habitId=${habitId}, type=${type}`);

            if (type === "habit") {
                let times = parseInt(this.dataset.times, 10);
                this.dataset.times = ++times;
                const textElement = this.querySelector(".z-index-99");
                if (textElement) {
                    textElement.innerText = times;
                }

                const isPositive = this.dataset.positive === "true";
                console.log(`Incrementing habit: isPositive=${isPositive}, times=${times}`);

                if (isPositive) {
                    userData.mood = Math.min(100, userData.mood + 5);
                    userData.money = Math.max(0, userData.money + 3);
                    userData.score += 10;
                } else {
                    userData.mood = Math.max(0, userData.mood - 5);
                    userData.money = Math.max(0, userData.money - 3);
                    userData.score += 2;
                }

                try {
                    await incrementHabitTimes(habitId);
                } catch (error) {
                    console.error('Error incrementing habit times:', error);
                }
            }

            updateUserInfo();
        });
    });
}
async function incrementHabitTimes(habitId) {
    try {
        const response = await fetch(`/habits/${habitId}/increment_times`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to increment habit times: ${response.statusText}`);
        }

        const updatedHabit = await response.json();
        console.log(`Habit ${updatedHabit.habit_id} times incremented to ${updatedHabit.times}`);
    } catch (error) {
        console.error('Error incrementing habit times:', error);
    }
}
   function addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv) {
       console.log('addCheckboxEventListeners called');
       document.querySelectorAll(".activities-checkBox, .activities-checkBox-negative, .activities-checkBox-greenMark").forEach((box) => {
           console.log('Adding event listener to checkbox');
           box.addEventListener("click", async function () {
               const isChecked = this.dataset.checked === "true";
               const type = this.dataset.type;

               console.log(`Checkbox clicked: type=${type}, isChecked=${isChecked}`);

               if (type === "dailies") {
                   const newCheckedState = !isChecked;
                   this.dataset.checked = newCheckedState;

                   const dailyElement = this.parentElement.parentElement;

                   if (newCheckedState) {
                       dailyElement.classList.replace("activities-task", "activities-task-negative");
                       this.classList.replace("activities-checkBox-", "activities-checkBox-greenMark");
                       completedTasksContainer.appendChild(dailyElement);
                   } else {
                       dailyElement.classList.replace("activities-task-negative", "activities-task");
                       this.classList.replace("activities-checkBox-greenMark", "activities-checkBox-");
                       incompleteTasksContainer.appendChild(dailyElement);
                   }

                   // Обновление состояния daily на сервере
                   try {
                       const dailyId = this.dataset.id;
                       console.log(`Updating daily with ID: ${dailyId}`);
                       await fetch(`/dailies/${dailyId}/toggle`, {
                           method: 'PATCH',
                           headers: {
                               'Content-Type': 'application/json'
                           },
                           body: JSON.stringify({ is_done: newCheckedState })
                       });
                   } catch (error) {
                       console.error('Error updating daily state', error);
                   }

                   updateTaskAndLabelVisibility(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
               }
           });
       });
   }
});

function updateTaskAndLabelVisibility(incompleteContainer, completeContainer, taskCountTextDiv, completedLabelTextDiv) {
    taskCountTextDiv.style.display = incompleteContainer.children.length > 0 ? 'block' : 'none';
    completedLabelTextDiv.style.display = completeContainer.children.length > 0 ? 'block' : 'none';
    }