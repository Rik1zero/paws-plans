const user_id = 1;
console.log("hi");
async function fetchData(endpoint, listElementId){
    try {
        const response = await fetch(endpoint);
        if (!response.ok)
            throw new Error('no network');

        const data = await response.json();
        const listElement = document.getElementById(listElementId);
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = JSON.stringify(item);
            listElement.appendChild(listItem);
        } );
    }
    catch(error){
        console.error('error fetching data', error)
    }
}



async function fetchDaily(endpoint, listElementId){

}



async function fetchTasks(endpoint, listElementId) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('no network');

        const data = await response.json();
        const listElement = document.getElementById(listElementId);
        listElement.innerHTML = '';

        const taskCount = document.createElement('div');
        taskCount.className = 'roboto-bold';
        taskCount.innerHTML = `Количество задач: ${data.length}`;
        listElement.appendChild(taskCount);

        data.forEach(item => {
            const className = item.is_done ? 'activities-task-negative' : 'activities-task-';
            const classTrue = item.is_done ? 'activities-checkBox-greenMark' : 'activities-checkBox-';
            const block = document.createElement('div');
            block.innerHTML = `
                <div class="${className} roboto-bold" style="display: flex; justify-content: space-between; width: 100%;">
                    <div>${item.name}</div>
                    <div class="activities-check ml-auto">
                        <div class="${classTrue}" data-checked="false"></div>
                    </div>
                </div>`;
            listElement.appendChild(block);
        });
    } catch (error) {
        console.error('error fetching data', error);
    }
}



async function fetchHabities(endpoint, listElementId) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('no network');

        const data = await response.json();
        const listElement = document.getElementById(listElementId);

        listElement.innerHTML = '';

        const taskCount = document.createElement('div');
        taskCount.className = 'roboto-bold';
        taskCount.innerHTML = `Количество привычек: ${data.length}`;
        listElement.appendChild(taskCount);

        data.forEach(item => {
            const block = document.createElement('div');
            block.innerHTML = item.is_positive
? `<div class="activities-task roboto-bold">
      <div>${item.name}</div>
      <div class="activities-check" style="margin-left: auto;">
          <div class="activities-checkBox green">
              <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
          </div>
      </div>
  </div>`
: `<div class="activities-task roboto-bold">
      <div class="activities-check">
          <div class="activities-checkBox-negative">
              <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
          </div>
      </div>
      <div class="ml-auto">${item.name}</div>
  </div>`;
            listElement.appendChild(block);
        });
    } catch (error) {
        console.error('error fetching data', error);
    }
}

async function fetchUser(user_id, information_block) {
    console.log(`Запрос данных для пользователя с ID: ${user_id}`); // Логируем ID пользователя

    try {
        const response = await fetch(`/users/${user_id}`);
        if (!response.ok) {
            console.error('Ошибка сети:', response.status, response.statusText); // Логируем статус ошибки
            throw new Error('Ошибка сети');
        }

        const data = await response.json();
        console.log('Данные пользователя получены:', data); // Логируем полученные данные

        const level_id = data.level_id || 'неизвестно' ;
        const score = data.score || 0;
        const mood = data.mood || 0;
        const money = data.money || 0;

        const levels = await fetch(`/levels/${level_id+1}`);

        if (!levels.ok) {
            console.error('Ошибка сети:', levels.status, levels.statusText); // Логируем статус ошибки
            throw new Error('Ошибка сети');
        }
        const dataL = await levels.json();
        const level_top = dataL.level_top || 0;

        const block = document.createElement('div');
        block.innerHTML = `
            <div class="informationBlock vert">
                <div class="level">
                    <div class="roboto-bold font-white">Уровень ${level_id}</div>
                    <div class="level-bar">
                        <div class="green-part light-green roboto-bold">${score}</div>
                    </div>
                    <div class="inline">
                        <div class="roboto-bold font-white">0</div>
                        <div class="roboto-bold font-white ml-auto">${level_top}</div>
                    </div>
                </div>
                <div class="mood">
                    <div class="roboto-bold font-white">настроение:</div>
                    <div class="mood-bar">
                        <div class="roboto-bold font-white">${mood}%</div>
                        <div class="level-mood-bar">
                            <div class="procent-mood orange roboto-bold"></div>
                        </div>
                    </div>
                </div>
                <div class="coinline mt-10">
                    <div class="coin-icon baseline"></div>
                    <div class="roboto-bold font-white baseline">${money}</div>
                    <button class="button roboto-bold ml-auto">магазин</button>
                </div>
            </div>`;

        if (information_block) {
            information_block.appendChild(block);
            console.log('Информация добавлена в DOM'); // Логируем успешное добавление
        } else {
            console.error('Указанный information_block не найден в DOM');
        }

    } catch (error) {
        console.error('Ошибка при получении данных', error); // Логируем ошибку
    }
}


fetchHabities(`/users/${user_id}/habbites`, "habbities-list");

fetchTasks(`/users/${user_id}/tasks`, "tasks-list");
console.log("js is working")


document.addEventListener("DOMContentLoaded", () => {
   const information_block = document.getElementById('user-info');
   fetchUser(user_id, information_block);
   document.querySelectorAll('.menu .type-button, .menu .marker-button').forEach(item => {
       item.addEventListener('click', function() {
           console.log('Клик по элементу меню:', this.textContent.trim());

           // Удаление класса 'active' у всех пунктов меню
           document.querySelectorAll('.menu div').forEach(item => item.classList.remove('active'));

           // Добавление класса 'active' к выбранному пункту меню
           this.classList.add('active');

           // Скрытие всех секций контента
           document.querySelectorAll('.content-section').forEach(section => {
               section.style.display = 'none';
           });

           // Определение целевой секции контента и отображение
           let targetContentId;
           if (this.querySelector('.task-icon')) {
               targetContentId = 'tasks-content';
           } else if (this.querySelector('.dayleak-icon')) {
               targetContentId = 'dailies-content';
           } else if (this.querySelector('.habit-icon')) {
               targetContentId = 'habits-content';
           } else if (this.querySelector('.settings-icon')) {
               targetContentId = 'settings-content';
           }

           if (targetContentId) {
               const targetContent = document.getElementById(targetContentId);
               if (targetContent) {
                   targetContent.style.display = 'block';
               } else {
                   console.error(`Целевая секция с ID ${targetContentId} не найдена`);
               }
           }
       });
   });
});
