FlowRouter.route('/', {
  name: "home",
  action() {
    BlazeLayout.setRoot('body');
    BlazeLayout.render('appBody', {sidePanel: "groupKit", mainPanel: "mapPanel"});
  }
});
