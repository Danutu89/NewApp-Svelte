describe('Index Page', () => {
	it('Index Page', function() {
		beforeEach(() => {
			cy.visit('/')
		});
	});
});

describe('Post Page', () => {
	it('Post Page', function() {
		beforeEach(() => {
			cy.visit('/post/How-we-can-overcome-distractions-and-stay-focused-as-developers-155')
		});
	});
});

describe('User Page', () => {
	it('Post Page', function() {
		beforeEach(() => {
			cy.visit('/user/danutu')
		});
	});
});