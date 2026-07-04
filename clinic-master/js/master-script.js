export async function createMaster(){
	let clinicData = null;
	let mapSvgCode = '';

	// クリニック情報を取得
	try{
		const response = await fetch('../clinic-master/js/clinic.json');
		clinicData = await response.json();
	}catch(e){
		console.error(e);
	}

	// map.svgをコードで取得
	try{
		const responsSvg = await fetch('../clinic-master/img/map.svg');
		mapSvgCode = await responsSvg.text();
	}catch(e){
		console.error(e);
	}

	createTitle();
	createMap();
	clinicAccordion();

	function createTitle(){
		const $title = $('.clinic__title');
		$title.html('<h2 class="clinic__title--main">クリニック一覧</h2><div class="clinic__title--sub1">ほとんどのクリニックが</div><div class="clinic__title--sub2">駅から5分以内</div>');
	}

	function createMap(){
		const $map = $('.clinic__map');
		$map.html(`<div class="clinic__mapimg">${mapSvgCode}</div>`)
	}

	// function clinicAccordion(){
	// 	const $list = $('.clinic__accordion');
	// 	$list.html('');
	// }

}