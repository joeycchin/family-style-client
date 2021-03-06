(function() {
  angular
    .module('app')
    .controller('MyTableController', MyTableController);

  MyTableController.$inject = ['$filter', 'getTable','tablesService',
  'socketService', 'usersService'];

  function MyTableController($filter, getTable, tablesService, socketService, usersService) {
    var vm = this;

    vm.chat = [];
    vm.dateTime = getTable.dateTime;
    vm.emitButton = emitButton;
    vm.eventId = getTable._id;
    vm.location = getTable.restaurantAddress;
    vm.max = getTable.max;
    vm.name = getTable.restaurantName;
    vm.users = getTable.users;
    vm.openMaps = tablesService.openMaps;

    activate();

    function activate() {
      socketService.emit('join', {eventId: vm.eventId, users: vm.users});
      socketService.emit('loadMessages', vm.eventId);
    }

    function emitButton(message) {
      socketService.emit('emitMessage', vm.eventId, {
        firstName: usersService.getFirstName(),
        message: message
      });
      vm.message = '';
    }

    socketService.removeAllListeners();

    socketService.on('loadMessages', function (messages) {
      vm.chat = messages;
    });

    socketService.on('updateUsers', function (updatedUsers) {
      vm.users = updatedUsers;
    });

    socketService.on('returnMessage', function (message) {
      vm.chat.push(message);
    });
  }
})();
