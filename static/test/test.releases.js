const assert = require('node:assert');
const staticData = require('../index');
const { releases } = require('../index');
const { describe, it } = require('node:test');

// always feel free to add more checks here - any addition will help ensure that we're even more solid.
//
// these tests are also generally copy/pasted between the test files - both in this file and in core. why?
// specifically because we want to be sure the data is consistent *and* because we want to be sure that
// the various ways of accessing the data produce consistent results.

function check(data) {
	// releases checks
	assert.deepStrictEqual(data.v17['v17.0.0'].dependencies.npm, '8.1.0');
	assert.deepStrictEqual(data.v17['v17.0.0'].dependencies.v8, '9.5.172.21');
	assert.deepStrictEqual(data.v16['v16.19.0'].dependencies.npm, '8.19.3');
	assert.deepStrictEqual(data.v16['v16.19.0'].files.available.length, 19);
	assert.deepStrictEqual(
		data.v16['v16.19.0'].files.links.macos[0].files[0],
		'node-v16.19.0-darwin-arm64.tar.gz',
	);
}

describe('test some known data in releases.json export, being called from the default require', async () => {
	it('should return the correct data for releases', () => {
		check(staticData.releases);
	});
});

describe('test some known data in releases.json export, being called from a named require', async () => {
	it('should return the correct data for all types', () => {
		check(releases);
	});
});
