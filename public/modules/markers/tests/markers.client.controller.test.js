'use strict';

(function() {
	// Markers Controller Spec
	describe('Markers Controller Tests', function() {
		// Initialize global variables
		var MarkersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Markers controller.
			MarkersController = $controller('MarkersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Marker object fetched from XHR', inject(function(Markers) {
			// Create sample Marker using the Markers service
			var sampleMarker = new Markers({
				name: 'New Marker'
			});

			// Create a sample Markers array that includes the new Marker
			var sampleMarkers = [sampleMarker];

			// Set GET response
			$httpBackend.expectGET('markers').respond(sampleMarkers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.markers).toEqualData(sampleMarkers);
		}));

		it('$scope.findOne() should create an array with one Marker object fetched from XHR using a markerId URL parameter', inject(function(Markers) {
			// Define a sample Marker object
			var sampleMarker = new Markers({
				name: 'New Marker'
			});

			// Set the URL parameter
			$stateParams.markerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/markers\/([0-9a-fA-F]{24})$/).respond(sampleMarker);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.marker).toEqualData(sampleMarker);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Markers) {
			// Create a sample Marker object
			var sampleMarkerPostData = new Markers({
				name: 'New Marker'
			});

			// Create a sample Marker response
			var sampleMarkerResponse = new Markers({
				_id: '525cf20451979dea2c000001',
				name: 'New Marker'
			});

			// Fixture mock form input values
			scope.name = 'New Marker';

			// Set POST response
			$httpBackend.expectPOST('markers', sampleMarkerPostData).respond(sampleMarkerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Marker was created
			expect($location.path()).toBe('/markers/' + sampleMarkerResponse._id);
		}));

		it('$scope.update() should update a valid Marker', inject(function(Markers) {
			// Define a sample Marker put data
			var sampleMarkerPutData = new Markers({
				_id: '525cf20451979dea2c000001',
				name: 'New Marker'
			});

			// Mock Marker in scope
			scope.marker = sampleMarkerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/markers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/markers/' + sampleMarkerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid markerId and remove the Marker from the scope', inject(function(Markers) {
			// Create new Marker object
			var sampleMarker = new Markers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Markers array and include the Marker
			scope.markers = [sampleMarker];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/markers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMarker);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.markers.length).toBe(0);
		}));
	});
}());