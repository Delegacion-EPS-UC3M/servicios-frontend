import type { PageLoad } from './$types';
import Papa from 'papaparse';

const FCSJ = '12.94%';
const FHCD = '9.57%';

export const load = (async () => {
	return {};
}) satisfies PageLoad;

let csv_data = `GRADO,P
ESCUELA POLITÉCNICA SUPERIOR,12.55%
Doble Grado Ciencia e Ingeniería de Datos - Ingeniería en Tecnologías de Telecomunicación,09.09%
Doble Grado en Ingeniería Informática y Administración de Empresas - Colmenarejo,18.18%
Doble Grado en Ingeniería Informática y Administración de Empresas - Leganés,11.82%
Grado en Ciencia e Ingeniería de Datos,06.58%
Grado en Ciencias,25.00%
Grado en Ingeniería Aeroespacial,13.67%
Grado en Ingeniería Biomédica,08.43%
Grado en Ingeniería de Comunicaciones Móviles y Espaciales,11.51%
Grado en Ingeniería de la Energía,10.33%
Grado en Ingeniería de Sonido e Imagen,08.49%
Grado en Ingeniería Eléctrica,10.13%
Grado en Ingeniería Electrónica Industrial y Automática,12.08%
Grado en Ingeniería en Tecnologías de Telecomunicación,13.5%
Grado en Ingeniería en Tecnologías Industriales,12.17%
Grado en Ingeniería Física,24.89%
Grado en Ingeniería Informática - Leganés,16.89%
Grado en Ingeniería Informática - Colmenarejo,17.31%
Grado en Ingeniería Mecánica,13.57%
Grado en Ingeniería Robótica,06.09%
Grado en Ingeniería Telemática,05.62%
Grado en Matemática Aplicada y Computación,09.46%`;

function parseCSV(csv: String) {
	// Parse CSV
	const parsedData = Papa.parse(csv, { header: true });
	parsedData.data.push({ GRADO: 'FCSJ', P: FCSJ });
	parsedData.data.push({ GRADO: 'FHCD', P: FHCD });

	// Sort data by percentage
	parsedData.data.sort((a: { [x: string]: string }, b: { [x: string]: string }) => {
		const percentageA = parseFloat(a['P'].replace('%', ''));
		const percentageB = parseFloat(b['P'].replace('%', ''));
		return percentageB - percentageA;
	});

	// Arrays to store names and percentages
	let names: any[] = [];
	let percentages: any[] = [];

	// Iterate through each row of parsed data
	parsedData.data.forEach((row: { [x: string]: string }) => {
		// Extract name and percentage from each row
		const name = row['GRADO'];
		const percentage = parseFloat(row['P']);

		// Push name and percentage to respective arrays
		names.push(name);
		percentages.push(percentage);
	});

	// Add the index to the names at the end
	names.forEach((name, index) => {
		names[index] = `${name} (${index + 1})`;
	});

	names.forEach((name, index) => {
		names[index] = name
			.replace(
				'Doble Grado Ciencia e Ingeniería de Datos - Ingeniería en Tecnologías de Telecomunicación',
				'Datos & Teleco'
			)
			.replace(
				'Doble Grado en Ingeniería Física e Ingeniería en Tecnologías Industriales',
				'Física & Industriales'
			)
			.replace('Administración de Empresas', 'ADE')
			.replace('Grado en Ingeniería', '')
			.replace('Ingeniería', '')
			.replace('Tecnologías', '')
			.replace('Grado', '')
			.replace('Doble', '')
			.replace(' de', ' ')
			.replace(' en', ' ')
			.replace(' la', ' ')
			.trimStart();
	});

	// Return the arrays
	return { names, percentages };
}

export const _data = parseCSV(csv_data);
