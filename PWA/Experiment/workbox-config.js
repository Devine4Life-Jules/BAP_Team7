module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{css,html,js}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	runtimeCaching: [{
		urlPattern: new RegExp('https://jsonplaceholder.typicode.com/users'),
		handler: 'StaleWhileRevalidate',
		options: {
			cacheName: 'api-cache',
			expiration: {
				maxEntries: 50,
				maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
			}
		}
	}, {
		// Example: If you add a posts endpoint
		urlPattern: new RegExp('https://jsonplaceholder.typicode.com/posts'),
		handler: 'StaleWhileRevalidate',
		options: {
			cacheName: 'api-cache',
			expiration: {
				maxEntries: 50,
				maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
			}
		}
	}]
};