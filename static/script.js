const user_id = 1;
let userData = { score: 0, mood: 0, money: 0 };

console.log("hi");

async function fetchData(endpoint, listElementId) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("no network");

    const data = await response.json();
    const listElement = document.getElementById(listElementId);
    data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = JSON.stringify(item);
      listElement.appendChild(listItem);
    });
  } catch (error) {
    console.error("error fetching data", error);
  }
}

async function fetchTasks(endpoint, listElementId) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("no network");

    const data = await response.json();
    const listElement = document.getElementById(listElementId);
    listElement.innerHTML = "";

    // Обернем надписи в <div> и добавим класс для стиля
    const taskCountTextDiv = document.createElement("div");
    const completedLabelTextDiv = document.createElement("div");
    taskCountTextDiv.className = "task-header";
    completedLabelTextDiv.className = "task-header";

    const incompleteTasks = data.filter((item) => !item.is_done);
    taskCountTextDiv.textContent = `Актуальные задачи:`;
    listElement.appendChild(taskCountTextDiv);

    const incompleteTasksContainer = document.createElement("div");
    incompleteTasksContainer.className = "task-container";
    listElement.appendChild(incompleteTasksContainer);

    completedLabelTextDiv.textContent = "Выполненные задачи";
    listElement.appendChild(completedLabelTextDiv);

    const completedTasksContainer = document.createElement("div");
    completedTasksContainer.className = "task-container";
    listElement.appendChild(completedTasksContainer);

    data.forEach((item) => {
      const className = item.is_done ? "activities-task-negative" : "activities-task";
      const checkClass = item.is_done ? "activities-checkBox-greenMark" : "activities-checkBox-";
      const block = document.createElement("div");
      block.className = "task-block";
      block.innerHTML = `
                <div class="${className} roboto-bold" style="display: flex; justify-content: space-between; width: 100%;">
                    <div>${item.name}</div>
                    <div class="activities-check ml-auto">
                        <div class="${checkClass}" data-id="${item.id}" data-type="task" data-checked="${item.is_done}"></div>
                    </div>
                </div>`;
      if (item.is_done) {
        completedTasksContainer.appendChild(block);
      } else {
        incompleteTasksContainer.appendChild(block);
      }
    });

    updateTaskAndLabelVisibility(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
    addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
  } catch (error) {
    console.error("error fetching data", error);
  }
}

async function fetchHabities(endpoint, listElementId) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("no network");

    const data = await response.json();
    const listElement = document.getElementById(listElementId);
    listElement.innerHTML = "";

    const taskCount = document.createTextNode(`Количество привычек: ${data.length}`);
    listElement.appendChild(taskCount);

    data.forEach((item) => {
      const block = document.createElement("div");
      const checkClass = item.is_positive ? "activities-checkBox green" : "activities-checkBox-negative";
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

    addCheckboxEventListeners();
  } catch (error) {
    console.error("error fetching data", error);
  }
}

async function fetchUser(user_id, information_block) {
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
    const block = `
        <div class="informationBlock vert">
            <div class="level">
                <div class="roboto-bold font-white">Уровень ${
                  userData.level_id || "неизвестно"
                }</div>
                <div class="level-bar">
                    <div style="width:${(userData.score / level_top) * 100}%;" class="green-part light-green roboto-bold">${
                      userData.score
                    }</div>
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
                        <div style="width:${userData.mood}%;" class="procent-mood orange roboto-bold"></div>
                    </div>
                </div>
            </div>
            <div class="coinline mt-10">
                <div class="coin-icon baseline"></div>
                <div class="roboto-bold font-white baseline">${userData.money}</div>
                <button class="button roboto-bold ml-auto">магазин</button>
            </div>
        </div>`;
    information_block.innerHTML = block;
  } catch (error) {
    console.error("Ошибка при обновлении информации пользователя", error);
  }
}

function updateTaskAndLabelVisibility(incompleteContainer, completeContainer, taskCountTextDiv, completedLabelTextDiv) {
  // Обновить видимость блока с количеством задач
  taskCountTextDiv.style.display = incompleteContainer.children.length > 0 ? 'block' : 'none';

  // Обновить видимость блока "Выполненные задачи"
  completedLabelTextDiv.style.display = completeContainer.children.length > 0 ? 'block' : 'none';
}

function addCheckboxEventListeners(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv) {
  document
    .querySelectorAll(
      ".activities-checkBox-, .activities-checkBox-negative, .activities-checkBox.green"
    )
    .forEach((box) => {
      box.addEventListener("click", function () {
        const isChecked = this.dataset.checked === "true";
        const type = this.dataset.type;

        if (type === "task") {
          if (!isChecked) {
            this.dataset.checked = true;
            userData.mood = Math.min(100, userData.mood + 10);
            userData.money = Math.max(0, userData.money + 5);
            userData.score += 15;

            const taskElement = this.parentElement.parentElement;
            taskElement.classList.replace(
              "activities-task",
              "activities-task-negative"
            );
            this.classList.replace(
              "activities-checkBox-",
              "activities-checkBox-greenMark"
            );

            // Перемещение элемента
            completedTasksContainer.appendChild(taskElement);

            // Обновление видимости и количества задач
            updateTaskAndLabelVisibility(incompleteTasksContainer, completedTasksContainer, taskCountTextDiv, completedLabelTextDiv);
          }
        } else if (type === "habit") {
          const isPositive = this.dataset.positive === "true";
          let times = parseInt(this.dataset.times, 10);
          this.dataset.times = ++times;
          const textElement = this.querySelector(".z-index-99");
          if (textElement) {
            textElement.innerText = times;
          }

          userData.score += 10;

          if (isPositive) {
            userData.mood = Math.min(100, userData.mood + 5);
            userData.money = Math.max(0, userData.money + 3);
          } else {
            userData.mood = Math.max(0, userData.mood - 5);
            userData.money = Math.max(0, userData.money - 3);
          }
        }

        updateUserInfo();
      });
    });
}


fetchHabities(`/users/${user_id}/habbites`, "habbities-list");
fetchTasks(`/users/${user_id}/tasks`, "tasks-list");

document.addEventListener("DOMContentLoaded", () => {
  const information_block = document.getElementById("user-info");
  fetchUser(user_id, information_block);
  let menuType = 1;
  document
    .querySelectorAll(".menu .type-button, .menu .marker-button")
    .forEach((item) => {
      item.addEventListener("click", function () {
        document
          .querySelectorAll(".menu div")
          .forEach((item) => item.classList.remove("active"));
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
        console.log('menu type',menuType);

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
        1:`<form class="pd-15">
    <input placeholder="Введите текст" class="form-txt"type="text" name="name" id="name" required />
            </form>
            <div class="horizontal-center">
                <button class="button-confirm">Подтвердить</button>
                <button class="button-cancel">Отменить</button>
            </div>`,
        2:`<form class="pd-15">
    <input placeholder="Введите текст" class="form-txt"type="text" name="name" id="name" required />
            </form>
            <div class="horizontal-center">
                <button class="button-confirm">Подтвердить</button>
                <button class="button-cancel">Отменить</button>
            </div>`,
        3:`<form class="pd-15">
    <input placeholder="Введите текст" class="form-txt"type="text" name="name" id="name" required />
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
      if (addActivities ){
        addActivities.addEventListener('click',function(){
            this.classList.toggle('rotated');
            if (this.classList.contains('rotated')){
                createTask.style.display = 'block';
                if(templates[menuType]){
                       createTask.innerHTML = templates[menuType];
                       console.log('menu type',menuType);
                }else{
                       createTask.innerHTML = `error`;
      }
            }

            else{
                createTask.style.display = 'none';
            }
        });
      }
});
