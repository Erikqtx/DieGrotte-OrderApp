/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  constructor() {
    this.orders = JSON.parse(localStorage.getItem("orders")) || [];
  }

  bindOrderListChanged(callback) {
    this.onOrderListChanged = callback;
  }

  _commit(orders) {
    this.onOrderListChanged(orders);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  addOrder(orderText) {
    const order = {
      id:
        this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1,
      text: orderText,
      complete: false,
    };

    this.orders.push(order);

    this._commit(this.orders);
  }

  editOrder(id, updatedText) {
    this.orders = this.orders.map((order) =>
      order.id === id
        ? { id: order.id, text: updatedText, complete: order.complete }
        : order
    );

    this._commit(this.orders);
  }

  deleteOrder(id) {
    this.orders = this.orders.filter((order) => order.id !== id);

    this._commit(this.orders);
  }

  toggleOrder(id) {
    this.orders = this.orders.map((order) =>
      order.id === id
        ? { id: order.id, text: order.text, complete: !order.complete }
        : order
    );

    this._commit(this.orders);
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {
    this.app = this.getElement("#root");
    this.form = this.createElement("form");
    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Add Order";
    this.input.name = "order";
    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Submit";
    this.form.append(this.input, this.submitButton);
    this.title = this.createElement("h1");
    this.title.textContent = "DieGrotte-Orders";
    this.orderList = this.createElement("ul", "order-list");
    this.app.append(this.title, this.form, this.orderList);

    this._temporaryOrderText = "";
    this._initLocalListeners();
  }

  get _orderText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = "";
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className) element.classList.add(className);

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  displayorders(orders) {
    // Delete all nodes
    while (this.orderList.firstChild) {
      this.orderList.removeChild(this.orderList.firstChild);
    }

    // Show default message
    if (orders.length === 0) {
      const p = this.createElement("p");
      p.textContent = "Nothing to serve? Take orders!";
      this.orderList.append(p);
    } else {
      // Create nodes
      orders.forEach((order) => {
        const li = this.createElement("li");
        li.id = order.id;

        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = order.complete;

        const span = this.createElement("span");
        span.contentEditable = true;
        span.classList.add("editable");

        if (order.complete) {
          const strike = this.createElement("s");
          strike.textContent = order.text;
          span.append(strike);
        } else {
          span.textContent = order.text;
        }

        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "Delete";
        li.append(checkbox, span, deleteButton);

        // Append nodes
        this.orderList.append(li);
      });
    }

    // Debugging
    console.log(orders);
  }

  _initLocalListeners() {
    this.orderList.addEventListener("input", (event) => {
      if (event.target.className === "editable") {
        this._temporaryOrderText = event.target.innerText;
      }
    });
  }

  bindAddOrder(handler) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this._orderText) {
        handler(this._orderText);
        this._resetInput();
      }
    });
  }

  bindDeleteOrder(handler) {
    this.orderList.addEventListener("click", (event) => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    });
  }

  bindEditOrder(handler) {
    this.orderList.addEventListener("focusout", (event) => {
      if (this._temporaryOrderText) {
        const id = parseInt(event.target.parentElement.id);

        handler(id, this._temporaryOrderText);
        this._temporaryOrderText = "";
      }
    });
  }

  bindToggleOrder(handler) {
    this.orderList.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    });
  }
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Explicit this binding
    this.model.bindOrderListChanged(this.onOrderListChanged);
    this.view.bindAddOrder(this.handleAddOrder);
    this.view.bindEditOrder(this.handleEditOrder);
    this.view.bindDeleteOrder(this.handleDeleteOrder);
    this.view.bindToggleOrder(this.handleToggleOrder);

    // Display initial orders
    this.onOrderListChanged(this.model.orders);
  }

  onOrderListChanged = (orders) => {
    this.view.displayorders(orders);
  };

  handleAddOrder = (orderText) => {
    this.model.addOrder(orderText);
  };

  handleEditOrder = (id, orderText) => {
    this.model.editOrder(id, orderText);
  };

  handleDeleteOrder = (id) => {
    this.model.deleteOrder(id);
  };

  handleToggleOrder = (id) => {
    this.model.toggleOrder(id);
  };
}

const app = new Controller(new Model(), new View());
