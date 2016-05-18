// imports/startup/client/routes.js
// Called from imports/startup/client/index.js

import { Session } from 'meteor/session';

FlowRouter.route('/:id', {
  name: "tokenHome",
  action() {
    BlazeLayout.setRoot('body');
    BlazeLayout.render('appBody', {sidePanel: "groupKit", mainPanel: "mapPanel"});
  }  
});

FlowRouter.route('/', {
  name: "home",
  action() {
    const randomToken = Random.id(6);
    FlowRouter.go("/"+randomToken);
  }
});
