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
            const className = item.is_done ? 'activities-task' : 'activities-task-negative';
            const block = document.createElement('div');
            block.innerHTML = `
                <div class="${className} roboto-bold" style="display: flex; justify-content: space-between; width: 100%;">
                    <div>${item.name}</div>
                    <div class="activities-check ml-auto">
                        <div class="activities-checkBox-"></div>
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
            block.className = 'activities-task roboto-bold';
            block.innerHTML = item.is_positive
                ? `<div>
                    <div>${item.name}</div>
                    <div class="activities-check ml-auto" style="margin-left:100% !important ; margin-right:0 !important;">
                        <div class="activities-checkBox green">
                            <div class="z-index-99 text-center mt-2 roboto-bold font-dark-grey">${item.times}</div>
                        </div>
                    </div>
                </div>`
                : `<div>
                    <div class="activities-check ml-auto">
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


fetchHabities(`/users/${user_id}/habbites`, "habbities-list");
 
fetchTasks(`/users/${user_id}/tasks`, "tasks-list");
console.log("js is working")
 
 
document.addEventListener("DOMContentLoaded", () => {
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
 
// document.querySelectorAll('.menu div').forEach(item => {
//     item.addEventListener('click', function() {
//         // Удаляем класс 'active' у всех пунктов меню
//         document.querySelectorAll('.menu div').forEach(item => item.classList.remove('active'));
//
//         // Удаляем класс 'active' у всех секций контента
//         document.querySelectorAll('.content-section').forEach(section => {
//             section.classList.remove('active');
//             section.style.display = 'none'; // Скрываем все секции
//         });
//
//         // Добавляем класс 'active' к выбранному пункту меню
//         this.classList.add('active');
//
//         // Определяем целевую секцию контента и добавляем ей класс 'active'
//         const targetContentId = this.getAttribute('data-target');
//         const targetContent = document.getElementById(targetContentId);
//         if (targetContent) {
//             targetContent.classList.add('active');
//             targetContent.style.display = 'block'; // Показываем выбранную секцию
//         }
//     });
// });