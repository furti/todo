(function(angular) {
    var todo = angular.module('todo');

    todo.directive('note', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    remove: '&onRemove'
                },
                link: function(scope, element, attrs) {
                    element.attr('class', 'note');
                },
                templateUrl: './templates/Note.html'
            };
        }
    ]);
})(angular);