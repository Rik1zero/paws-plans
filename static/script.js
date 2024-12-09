const user_id = 1;

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

async function fetchUser(userId, informationBlockId) {
    try {
        const response = await fetch(`/users/${userId}`);
        if (!response.ok) throw new Error('Ошибка сети');

        const data = await response.json();
        const informationBlock = document.getElementById(informationBlockId);

        const level_id = data.level_id || 'неизвестно';
        const score = data.score || 0;
        const mood = data.mood || 0;
        const money = data.money || 0;

        const block = document.createElement('div');
        block.innerHTML = `
            <div class="level">
                <div class="roboto-bold font-white">Уровень ${level_id}</div>
                <div class="level-bar">
                    <div class="green-part light-green roboto-bold">${score}</div>
                </div>
                <div class="inline">
                    <div class="roboto-bold font-white">0</div>
                    <div class="roboto-bold font-white ml-auto">800</div>
                </div>
            </div>
            <div class="mood">
                <div class="roboto-bold font-white">Настроение:</div>
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
            </div>`;

        if (informationBlock) {
            informationBlock.innerHTML = '';
            informationBlock.appendChild(block);
        } else {
            console.error('Указанный informationBlock не найден в DOM');
        }
    } catch (error) {
        console.error('Ошибка при получении данных пользователя', error);
    }
}


async function fetchTasks(endpoint, listElementId){
    try {
        const response = await fetch(endpoint);
        if (!response.ok)
            throw new Error('no network');

        const data = await response.json();
        const listElement = document.getElementById(listElementId);
        data.forEach(item => {
            className = item.is_done ?'activities-task':'activities-task-negative';
            const block = document.createElement('div');
            block.innerHTML = `<div class="${className} roboto-bold" style = "display:flex;justify-content: space-between;">
        <div> ${item.name}</div>
            <div class="activities-check ml-auto">
          <div class="activities-checkBox-">
          </div>
        </div>
        </div>`
            listElement.appendChild(block);
        } );
    }
    catch(error){
        console.error('error fetching data', error);
    }
}



async function fetchHabities(endpoint, listElementId){
    try {
        const response = await fetch(endpoint);
        if (!response.ok)
            throw new Error('no network');

        const data = await response.json();
        const listElement = document.getElementById(listElementId);
        data.forEach(item => {
          //  className = item.is_positive ?'activities-checkBox green':`activities-checkBox-negative`;
            const block = document.createElement('div');
            block.innerHTML =item.is_positive ? `<div class="activities-task roboto-bold">
            <div>${item.name}</div>
        <div class="activities-check ml-auto">
          <div class="activities-checkBox green">
              <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
          </div>
        </div>
        </div><br/>`:`<div class="activities-task roboto-bold">

        <div class="activities-check ml-auto">
          <div class="activities-checkBox-negative">
              <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
          </div>
        </div>
        <div class = "ml-auto">${item.name}</div>
        </div><br/>`;
            listElement.appendChild(block);
        } );
    }
    catch(error){
        console.error('error fetching data', error);
    }
}

fetchHabities(`/users/${user_id}/habbites`, "habbities-list");

fetchTasks(`/users/${user_id}/tasks`, "tasks-list");

document.addEventListener("DOMContentLoaded", () => {
    fetchUser(user_id, "user-info");
    fetchHabities(`/users/${user_id}/habbites`, "habbities-list");
    fetchTasks(`/users/${user_id}/tasks`, "tasks-list");

    document.querySelectorAll('.menu div').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu div').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });

            this.classList.add('active');
            const targetContentId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetContentId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
            }
        });
    });
});


document.querySelectorAll('.menu div').forEach(item => {
    item.addEventListener('click', function() {
        // Удаляем класс 'active' у всех пунктов меню
        document.querySelectorAll('.menu div').forEach(item => item.classList.remove('active'));

        // Удаляем класс 'active' у всех секций контента
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none'; // Скрываем все секции
        });

        // Добавляем класс 'active' к выбранному пункту меню
        this.classList.add('active');

        // Определяем целевую секцию контента и добавляем ей класс 'active'
        const targetContentId = this.getAttribute('data-target');
        const targetContent = document.getElementById(targetContentId);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block'; // Показываем выбранную секцию
        }
    });
});
