(function(angular) {
    var todo = angular.module('todo');

    todo.directive('note', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    remove: '&onRemove',
                    edited: '&onEdit'
                },
                controller: ['$scope', '$modal',
                    function($scope, $modal) {
                        $scope.doRemove = function() {
                            var modal = $modal.open({
                                scope: $scope,
                                templateUrl: './templates/DeleteNote.html'
                            });

                            modal.result.then(function() {
                                $scope.remove($scope.data);
                            });
                        };

                        $scope.editMode = false;

                        $scope.edit = function($event) {
                            $scope.editMode = true;

                            $event.stopPropagation();
                        };

                        $scope.finishEdit = function() {
                            $scope.editMode = false;

                            $scope.edited($scope.data);
                        };
                    }
                ],
                link: function(scope, element, attrs) {
                    element.attr('class', 'note');
                },
                templateUrl: './templates/Note.html'
            };
        }
    ]);
})(angular);