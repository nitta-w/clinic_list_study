export async function createMaster(){
	let clinicDatas = [];
	let mapSvgCode = '';
	let pinSvgCode = '';

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

	// map.svg pin.svgをコードで取得
	try{
		const responsMapSvg = await fetch('../clinic-master/img/map.svg');
		const responsPinSvg = await fetch('../clinic-master/img/pin.svg');
		if (!responsMapSvg.ok) {
            throw new Error(`mapのSVGが見つからないよ: ${responsMapSvg.status}`);
        }
		if (!responsPinSvg.ok) {
            throw new Error(`pinのSVGが見つからないよ: ${responsPinSvg.status}`);
        }
		mapSvgCode = await responsMapSvg.text();
		pinSvgCode = await responsPinSvg.text();
	}catch(e){
		console.error(e);
	}

	createTitle();
	createMap();
	clinicAccordion();
	addEventListener();

	function createTitle(){
		const $title = $('.clinic__title');
		$title.html('<h2 class="clinic__title--main">クリニック一覧</h2><div class="clinic__title--sub1">ほとんどのクリニックが</div><div class="clinic__title--sub2">駅から5分以内</div>');
	}

	function createMap(){
		const $map = $('.clinic__map');
		let areaHtml = '';
		let areaHtmlItem = [];

		for(let i = 0; i < clinicDatas.length; i++){
			const area = clinicDatas[i].area;
			const areaKey = getAreaKey(i);

			const coloredPinSvg = pinSvgCode.replace('<svg', `<svg class="${areaKey[1]}"`)
			areaHtmlItem.push(`<button class="area-btn area-btn${areaKey[0]}" data-area="${areaKey[0]}">${coloredPinSvg}${area}</button>`);
		}

		areaHtml = (areaHtmlItem.join(''));

		$map.html(`<div class="clinic__mapimg">${mapSvgCode}${areaHtml}</div>`)

	}

	function clinicAccordion(){
		const $accordion = $('.clinic__accordion');
		let createHtml = [];

		for(let i = 0; i < clinicDatas.length; i++){
			const area = clinicDatas[i].area;
			const areaKey = getAreaKey(i);

			createHtml.push(`<details class="accordion">
								<summary class="accordion__area" data-area="${areaKey[0]}">${area}</summary>`);

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

	function addEventListener(){
		$('.area-btn').on('click', function(){
			const targetAreaId = $(this).data('area');
			const $targetAccordion = $(`.accordion__area[data-area="${targetAreaId}"]`).closest('.accordion');

			$('.accordion').not($targetAccordion).removeAttr('open'); // 開いているアコーディオンを閉じる
			$targetAccordion.find('.accordion__area').trigger('click');

			setTimeout(function(){
				const targetPosition = $targetAccordion.offset().top;
				$(window).scrollTop(targetPosition - 20);
			}, 100);
		})
	}

	function getAreaKey(i){
        const areaMaster = {
            1 : ['北海道・東北','st8'], // エリア名, 色用class名
            2 : ['東京','st5'],
            3 : ['関東','st5'],
            4 : ['中部','st2'],
            5 : ['近畿','st7'],
            6 : ['中国・四国','st6'],
            7 : ['九州・沖縄','st4']
        }

		const area = clinicDatas[i].area;
		const areaKey = Object.keys(areaMaster).find(key => areaMaster[key][0] === area);
		const colorData = areaKey ? areaMaster[areaKey][1] : 'st1';
		const finalKey = areaKey || '0';

		return [finalKey, colorData];
	}

}