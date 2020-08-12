class Model {
  constructor() {
    //Array of the objects
    this.orders = [
      { id: 1, text: "Test1", complete: false },
      { id: 2, text: "Test2", complete: false },
    ];
  }
  addOrder(orderText) {
    const order = {
      id:
        this.orders.length > 0 ? this.order[this.orders.length - 1].id + 1 : 1,
      text: orderText,
      complete: false,
    };
    this.orders.push(order);
  }

  //Map through all orders and replace the text of orders with the specific id
  editOrders(id, updatedText) {
    this.orders = this.orders.map((order) =>
      order.id === id
        ? { id: order.id, text: updatedText, complete: order.complete }
        : order
    );
  }
  //Delete the Order
  deleteOrder(id) {
    this.orders = this.orders.filter((order) => order.id !== id);
  }

  //Flip the boolean on the specific order
  toggleOrder(id) {
    this.orders = this.orders.map((order) =>
      order.id === id
        ? { id: order.id, text: order.text, complete: !order.complete }
        : order
    );
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());
