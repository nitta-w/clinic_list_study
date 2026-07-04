$(async function(){
	try{
		const master = await import('../../clinic-master/js/master-script.js');
		master.createMaster();
	}catch(e){
		console.error(e);
	}
})

$(function(){
	
})


