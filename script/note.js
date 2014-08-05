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
                controller: ['$scope', '$modal', '$timeout',
                    function($scope, $modal, $timeout) {
                        var ctrl = this;

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

                            $timeout(function() {
                                ctrl.textarea[0].focus();
                            }, 10);


                            $event.stopPropagation();
                        };

                        $scope.finishEdit = function() {
                            $scope.editMode = false;

                            $scope.edited($scope.data);
                        };
                    }
                ],
                link: function(scope, element, attrs, ctrl) {
                    element.attr('class', 'note');

                    element.children('div').on('dblclick', function(event) {
                        event.stopPropagation();
                    });

                    ctrl.textarea = element.find('textarea');
                },
                templateUrl: './templates/Note.html'
            };
        }
    ]);
})(angular);