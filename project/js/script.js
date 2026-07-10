$(async function(){
	try{
		const master = await import('../../clinic-master/js/master-script.js');

		// demo1
		master.createMaster('demo1');

		// demo2
		master.createMaster('demo2');

	}catch(e){
		console.error(e);
	}
})



