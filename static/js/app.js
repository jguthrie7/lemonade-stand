/**
 * Created by JohnGuthrie on 2/16/17.
 */
// MODULE
var myApp = angular.module('myApp', ['ngRoute']);
myApp.config(function($routeProvider) {

  $routeProvider

    .when('/', {
      templateUrl: 'main.html',
      controller: 'loginController',
      controllerAs: 'vm'
    })
    .when('/create-account', {
      templateUrl: 'create-account.html',
      controller: 'createController',
      controllerAs: 'vm'
    })
    .when('/invoice-create', {
      templateUrl: 'invoice-create.html',
      controller: 'invoiceController',
      controllerAs: 'vm'
    })
    .when('/view-history', {
      templateUrl: 'view-history.html',
      controller: 'viewHistoryController',
      controllerAs: 'vm'
    })
});