(function(angular) {
    var todo = angular.module('todo');

    todo.directive('options', ['$animate',

        function($animate) {

            return {
                restrict: 'E',
                scope: {
                    exportOption: '&onExport'
                },
                controller: ['$scope',
                    function($scope) {
                        $scope.open = false;
                    }
                ],
                link: function(scope, element, attrs) {
                    element.attr('class', 'todo-options');

                    element.on('click', function(event) {
                        scope.open = !scope.open;

                        if (scope.open) {
                            $animate.addClass(element, 'open');
                        } else {
                            $animate.removeClass(element, 'open');
                        }
                    });
                },
                templateUrl: './templates/Options.html'
            };
        }
    ]);
})(angular);