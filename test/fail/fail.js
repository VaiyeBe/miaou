var buster = require("buster");
	


buster.testCase("Fail", {
	"failure": function(){
		buster.assert(false);
	},
});
