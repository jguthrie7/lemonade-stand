/**
 * Created by JohnGuthrie on 2/16/17.
 */
myApp.controller('loginController', ['$window', '$location', 'Auth', 'Session',
  function ($window, $location, Auth, Session) {

    var vm = this;
    vm.login = login;

    function login(username, password) {
      Auth.login(username, password)
        .then(function (res) {
          if (res.success) {
            //  Store the token in local storage
            $window.localStorage.setItem('token', res.data.token);
            console.log($window.localStorage.getItem('token'));
            Session.setName(username);
            $location.path('/invoice-create');
          } else {
            alert('Login failed - ' + res.message);
          }
        })
        .catch(function (err) {
          console.log('err');
          console.log(err);
          alert('error during login - ' + err.data.message);
        })
    }
  }])

  .controller('createController', ['$location', 'Auth',
    function ($location, Auth) {
      var vm = this;
      vm.signup = signup;

      function signup(username, password) {
        Auth.signup(username, password)
          .then(function (res) {
            if (res.success) {
              alert(res.message);
              $location.path('/');
            } else {
              alert('create account failed - ' + res.message);
            }
          })
          .catch(function (err) {
            alert('error during create account - ' + err.data.message)
          })
      }
    }])

.controller('invoiceController', ['$location', '$window', 'Session', 'Auth', function($location, $window, Session, Auth) {
  var vm = this;
  vm.username = Session.getName();
  vm.submitForm = submitForm;
  vm.token = $window.localStorage.getItem('token');

  function submitForm(amount) {
    $window.location.href = '/invoice';
  }
}])

.controller('viewHistoryController', ['$location', '$window', 'Auth', 'Session', function($location, $window, Auth, Session) {
  var vm = this;
  vm.invoices = [];
  vm.username = Session.getName();
  Auth.getInvoices($window.localStorage.getItem('token'))
    .then(function(res) {
      console.log('getInvoices');
      console.log(res);
      vm.invoices = res;
    });
}])
