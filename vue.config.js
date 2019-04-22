module.exports = {
	devServer: {
		proxy: {
			"/ws/room": {
				target: "http://localhost:3000",
				ws: true
			},
			"/api": {
				target: "http://localhost:3000",
				ws: false
			},
		}
	}
};