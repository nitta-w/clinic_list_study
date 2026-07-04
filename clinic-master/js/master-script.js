export async function createMaster(){
	let clinicDatas = [];
	let mapSvgCode = '';

	// クリニック情報を取得
	try{
		const response = await fetch('../clinic-master/js/clinic.json');
		if (!response.ok) {
			throw new Error(`jsonが見つからないよ: ${response.status}`);
		}
		clinicDatas = await response.json();
	}catch(e){
		console.error(e);
	}
	console.log(clinicDatas);

	// map.svgをコードで取得
	try{
		const responsSvg = await fetch('../clinic-master/img/map.svg');
		if (!responsSvg.ok) {
            throw new Error(`SVGが見つからないよ: ${responsSvg.status}`);
        }
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

	function clinicAccordion(){
		const $accordion = $('.clinic__accordion');
		let createHtml = [];

		for(let i = 0; i < clinicDatas.length; i++){
			const area = clinicDatas[i].area;
			createHtml.push(`<details class="accordion">
								<summary class="accordion__area">${area}</summary>`);

			const clinicData = clinicDatas[i].clinics;

			for(let j = 0; j < clinicData.length; j++){
				const clinicName = clinicData[j].clinic_name;
				const clinicHoursStart = clinicData[j].hours.business_start;
				const clinicHoursEnd = clinicData[j].hours.business_end;
				const clinicAddress = clinicData[j].address;
				const clinicAccess = clinicData[j].full;

				createHtml.push(`
					<div class="inner">
						<p class="inner__name">${clinicName}</p>
						<p class="inner__hours"><span class="inner__ttl">診療時間：</span><span>${clinicHoursStart}〜${clinicHoursEnd}</span></p>
						<p class="inner__address"><span class="inner__ttl">住所：</span><span>${clinicAddress}</span></p>
						<p class="inner__access"><span class="inner__ttl">アクセス：</span><span>${clinicAccess}</span></p>
					</div>
				`)
			}

			createHtml.push('</details>');			
		}

		$accordion.html(createHtml.join(''));
		
	}

}