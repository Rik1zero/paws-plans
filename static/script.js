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
            block.innerHTML = `<div class="${className} roboto-bold">
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
