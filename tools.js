//1 获取一个json的长度
function getJsonLength(jsonData) {
	var jsonLength = 0;
	for(var item in jsonData) {
		jsonLength++;
	}
	return jsonLength;
}

//2 比较两个jsonArray的不同,其中array1是原数组，array2是修改后的数组
function ComparArray(_array1, _array2) {
	let array1 = JSON.parse(JSON.stringify(_array1));
	let array2 = JSON.parse(JSON.stringify(_array2));

	let update_flag = true;
	let array_update = []
	let array_update_str = []
	for(let i = 0; i < array1.length; i++) {
		for(let j in array1[i]) {
			if(array1[i][j] != array2[i][j]) {
				for(let k = 0; k < array_update.length; k++) {
					if(array_update[k].id == array2[i].id) {
						update_flag = false
					}
				}
				if(update_flag == true) {
					array_update.push({
						id: array2[i].id
					})
				}

				//上面这个for循环和if是为了判断需不需要新增id

				for(let k = 0; k < array_update.length; k++) {
					if(array_update[k].id == array2[i].id) {
						array_update[k][j] = array2[i][j]
					}
				}
				update_flag = true;
			}
		}
	}
}


var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
var chnUnitChar = ["", "十", "百", "千"];

function SectionToChinese(section) {
	var strIns = '',
		chnStr = '';
	var unitPos = 0;
	var zero = true;
	while(section > 0) {
		var v = section % 10;
		if(v === 0) {
			if(!zero) {
				zero = true;
				chnStr = chnNumChar[v] + chnStr;
			}
		} else {
			zero = false;
			strIns = chnNumChar[v];
			strIns += chnUnitChar[unitPos];
			chnStr = strIns + chnStr;
		}
		unitPos++;
		section = Math.floor(section / 10);
	}
	return chnStr;
}

//3 数字转中文
function NumberToChinese(num) {
	var unitPos = 0;
	var strIns = '',
		chnStr = '';
	var needZero = false;

	if(num === 0) {
		return chnNumChar[0];
	}

	while(num > 0) {
		var section = num % 10000;
		if(needZero) {
			chnStr = chnNumChar[0] + chnStr;
		}
		strIns = SectionToChinese(section);
		strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
		chnStr = strIns + chnStr;
		needZero = (section < 1000) && (section > 0);
		num = Math.floor(num / 10000);
		unitPos++;
	}

	return chnStr;
}

var chnNumChar1 = {
	零: 0,
	一: 1,
	二: 2,
	三: 3,
	四: 4,
	五: 5,
	六: 6,
	七: 7,
	八: 8,
	九: 9
};

var chnNameValue = {
	十: {
		value: 10,
		secUnit: false
	},
	百: {
		value: 100,
		secUnit: false
	},
	千: {
		value: 1000,
		secUnit: false
	},
	万: {
		value: 10000,
		secUnit: true
	},
	亿: {
		value: 100000000,
		secUnit: true
	}
}

//4 中文转数字
function ChineseToNumber(chnStr) {
	var rtn = 0;
	var section = 0;
	var number = 0;
	var secUnit = false;
	var str = chnStr.split('');

	for(var i = 0; i < str.length; i++) {
		var num = chnNumChar1[str[i]];
		if(typeof num !== 'undefined') {
			number = num;
			if(i === str.length - 1) {
				section += number;
			}
		} else {
			var unit = chnNameValue[str[i]].value;
			secUnit = chnNameValue[str[i]].secUnit;
			if(secUnit) {
				section = (section + number) * unit;
				rtn += section;
				section = 0;
			} else {
				section += (number * unit);
			}
			number = 0;
		}
	}
	return rtn + section;
}

//5 数组转tree
function composeTree(list = []) {
	//const data = JSON.parse(JSON.stringify(list)) // 浅拷贝不改变源数据
	const data = list
	const result = []
	if (!Array.isArray(data)) {
		return result
	}
	data.forEach(item => {
		// delete item.children
		item.children = []
	})
	const map = {}
	data.forEach(item => {
		map[item.id] = item
	})
	data.forEach(item => {
		const parent = map[item.fatherid]
		if (parent) {
			(parent.children || (parent.children = [])).push(item)
		} else {
			result.push(item)
		}
	})
	return result
}
