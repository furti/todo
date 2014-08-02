(function(angular) {
    var todo = angular.module('todo');

    todo.directive('drag', ['$parse',

        function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var getter = $parse(attrs.drag);

                    element.attr('draggable', 'true');

                    element.on('dragstart', function(event) {
                        event.dataTransfer.setData('application/json', angular.toJson(getter(scope)));
                    });
                }
            };
        }
    ]);

    todo.directive('drop', [

        function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var expression = attrs.drop;

                    element.on('dragover', function(event) {
                        event.preventDefault();
                    });

                    element.on('drop', function(event) {
                        event.preventDefault();

                        var data = angular.fromJson(event.dataTransfer.getData('application/json'));

                        scope.$apply(function() {
                            scope.$eval(expression, {
                                '$dragData': data
                            });
                        })
                    });
                }
            };
        }
    ]);

})(angular);