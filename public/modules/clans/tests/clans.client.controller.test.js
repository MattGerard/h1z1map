'use strict';

(function() {
	// Clans Controller Spec
	describe('Clans Controller Tests', function() {
		// Initialize global variables
		var ClansController,
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

			// Initialize the Clans controller.
			ClansController = $controller('ClansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Clan object fetched from XHR', inject(function(Clans) {
			// Create sample Clan using the Clans service
			var sampleClan = new Clans({
				name: 'New Clan'
			});

			// Create a sample Clans array that includes the new Clan
			var sampleClans = [sampleClan];

			// Set GET response
			$httpBackend.expectGET('clans').respond(sampleClans);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clans).toEqualData(sampleClans);
		}));

		it('$scope.findOne() should create an array with one Clan object fetched from XHR using a clanId URL parameter', inject(function(Clans) {
			// Define a sample Clan object
			var sampleClan = new Clans({
				name: 'New Clan'
			});

			// Set the URL parameter
			$stateParams.clanId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/clans\/([0-9a-fA-F]{24})$/).respond(sampleClan);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clan).toEqualData(sampleClan);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Clans) {
			// Create a sample Clan object
			var sampleClanPostData = new Clans({
				name: 'New Clan'
			});

			// Create a sample Clan response
			var sampleClanResponse = new Clans({
				_id: '525cf20451979dea2c000001',
				name: 'New Clan'
			});

			// Fixture mock form input values
			scope.name = 'New Clan';

			// Set POST response
			$httpBackend.expectPOST('clans', sampleClanPostData).respond(sampleClanResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Clan was created
			expect($location.path()).toBe('/clans/' + sampleClanResponse._id);
		}));

		it('$scope.update() should update a valid Clan', inject(function(Clans) {
			// Define a sample Clan put data
			var sampleClanPutData = new Clans({
				_id: '525cf20451979dea2c000001',
				name: 'New Clan'
			});

			// Mock Clan in scope
			scope.clan = sampleClanPutData;

			// Set PUT response
			$httpBackend.expectPUT(/clans\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/clans/' + sampleClanPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid clanId and remove the Clan from the scope', inject(function(Clans) {
			// Create new Clan object
			var sampleClan = new Clans({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Clans array and include the Clan
			scope.clans = [sampleClan];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/clans\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClan);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.clans.length).toBe(0);
		}));
	});
}());