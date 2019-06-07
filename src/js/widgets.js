export class TaskListWidget {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.items = [];
        this.init();
    }

    init() {
        this.parentEl.innerHTML = `
            <h1>Task Tracker <span data-id="items-count" class="badge badge-primary">0</span></h1>
            <div class="row">
                <div class="col-sm-10">
                    <input data-id="name" type="text" class="form-control">
                </div>
                <div class="col">
                    <button data-action="add" class="btn btn-block btn-primary">Add</button>
                </div>
            </div>
            <div data-id="alert-msg" class="alert alert-danger" role="alert">Task already exists!</div>
            <ul data-id="items" class="list-group mt-3"></ul>
        `;

        this.itemsCountEl = this.parentEl.querySelector('[data-id=items-count]');
        this.nameInputEl = this.parentEl.querySelector('[data-id=name]');
        this.addBtn = this.parentEl.querySelector('[data-action=add]');
        this.addBtn.addEventListener('click', () => this.onAdd());

        this.alertMsgEl = this.parentEl.querySelector('[data-id=alert-msg]');
        this.alertMsgEl.style.display = 'none';

        this.itemsEl = this.parentEl.querySelector('[data-id=items]');
    }

    onAdd() {
        const value = this.nameInputEl.value;
        if (this.items.includes(value)) {
            this.alertMsgEl.style.display = '';
            return;
        }

        this.items.push(value);
        this.rebuildItems();
        this.nameInputEl.value = '';
    }

    rebuildItems() {
        this.itemsEl.innerHTML = '';
        this.alertMsgEl.style.display = 'none';
        for (const item of this.items) {
            const liEl = document.createElement('li');
            liEl.className = 'list-group-item';

            liEl.innerHTML = `
                ${item}
                <button data-action="remove" class="btn btn-danger btn-sm float-right">X</button>
                <button data-action="down" class="btn btn-success btn-sm float-right">&#8595;</button>
                <button data-action="up" class="btn btn-success btn-sm float-right">&#8593;</button>
            `;

            liEl.querySelector('[data-action=remove]')
                .addEventListener('click', () => this.onRemove(item));
            liEl.querySelector('[data-action=up]')
                .addEventListener('click', () => this.onUp(item));
            liEl.querySelector('[data-action=down]')
                .addEventListener('click', () => this.onDown(item));

            if (this.items[0] === item) {
                liEl.querySelector('[data-action=up]').style.display = 'none';
            }
            if (this.items[this.items.length - 1] === item) {
                liEl.querySelector('[data-action=down]').style.display = 'none';
            }

            this.itemsEl.appendChild(liEl);
        }

        this.itemsCountEl.innerHTML = `${this.items.length}`;
    }

    onRemove(item) {
        const indexOf = this.items.indexOf(item);
        this.items.splice(indexOf, 1);

        this.rebuildItems();
    }

    onUp(item) {
        const indexFrom = this.items.indexOf(item);
        this.items.splice(indexFrom - 1, 0, this.items.splice(indexFrom, 1)[0]);

        this.rebuildItems();
    }

    onDown(item) {
        const indexFrom = this.items.indexOf(item);
        this.items.splice(indexFrom + 1, 0, this.items.splice(indexFrom, 1)[0]);

        this.rebuildItems();
    }
}