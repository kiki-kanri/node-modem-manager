import camelcaseKeys from '@cjs-exporter/camelcase-keys';

import { Dict } from '../typing';

const parseDataMap: {
	[key: string]: boolean | null | undefined;
} = {
	'--': null,
	'no': false,
	'yes': true
};

export const isNumeric = (data: any) => {
	return !isNaN(parseFloat(data)) && isFinite(data);
}

export const parseData = (data: Dict<any>) => {
	for (const key in data) {
		const value = data[key];
		const parsedValue = parseDataMap[value];

		if (parsedValue !== undefined) {
			data[key] = parsedValue;
		} else if (value.constructor === Object) {
			parseData(data[key]);
		} else if (['imei', 'iccid', 'imsi'].includes(key)) {
		} else if (isNumeric(value)) {
			const parsedFloat = parseFloat(value);
			if (parsedFloat.toString() === value) data[key] = parsedFloat;
		}
	}
}

export const parseResultData = (data: Dict<any>) => {
	const convertedData = camelcaseKeys(data, { deep: true });
	parseData(convertedData);
	return sortDictKey(convertedData);
}

export const sortDictKey = (data: Dict<any>): Dict<any> => {
	const sorted = [];
	for (const key in data) sorted.push(key);
	sorted.sort();
	const tmpDict: Dict<any> = {};
	for (const key of sorted) tmpDict[key] = data[key];
	for (const key in tmpDict) if (tmpDict[key] && tmpDict[key].constructor === Object) tmpDict[key] = sortDictKey(tmpDict[key]);
	return tmpDict;
}
