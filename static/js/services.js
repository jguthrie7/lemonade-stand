/**
 * Created by JohnGuthrie on 2/16/17.
 */
myApp.factory('Auth', ['$http', function ($http) {

  return {
    login: authFactory('login'),
    signup: authFactory('signup'),
    createInvoice: createInvoice,
    getInvoices: getInvoices,
  };

  //  Function factory for creating the login and signup methods
  function authFactory(endpoint) {
    return function (email, password) {
      var payload = {
        email: email,
        password: password
      };
      return $http.post('/lemonade-stand/auth/' + endpoint, payload)
        .then(function (res) {
          return res.data;
        });
    }
  }

  function createInvoice(amount) {
    return $http.post('/lemonade-stand/invoice', { amount: amount })
      .then(function (res) {
        return res;
      })
  }

  function getInvoices(token) {
    var req = {
      method: 'GET',
      url: '/lemonade-stand/myInvoice',
      headers: {
        Authorization: 'Bearer ' + token
      }
    };
    return $http(req)
      .then(function(res) {
        return res.data;
      })
  }
}

])

  .factory('Session', ['$window', function ($window) {
    this.username = '';

    return {
      setName: setName,
      getName: getName,
      logout: logout
    };

    function setName(name) {
      $window.localStorage.setItem('name',name);
    }

    function getName() {
      return $window.localStorage.getItem('name');
    }
    function  logout() {
      $window.localStorage.setItem('name', '');
      $window.localStorage.setItem('token', '');
    }


  }]);