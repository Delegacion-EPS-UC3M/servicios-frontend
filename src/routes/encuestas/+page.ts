import type { PageLoad } from './$types';
import Papa from 'papaparse';

const FCSJ = '26.26%';
const FHCD = '33.80%';

export const load = (async () => {
	return {};
}) satisfies PageLoad;

let csv_data = `GRADO,P
ESCUELA POLITÉCNICA SUPERIOR,33.48%
Doble Grado Ciencia e Ingeniería de Datos - Ingeniería en Tecnologías de Telecomunicación,27.67%
Doble Grado en Ingeniería Física e Ingeniería en Tecnologías Industriales,0.0%
Doble Grado en Ingeniería Informática y Administración de Empresas - Leganés,35.32%
Doble Grado en Ingeniería Informática y Administración de Empresas - Colmenarejo,29.41%
Grado en Ciencia e Ingeniería de Datos,30.48%
Grado en Ciencias,23.29%
Grado en Ingeniería Aeroespacial,49.11%
Grado en Ingeniería Biomédica,36.98%
Grado en Ingeniería de Comunicaciones Móviles y Espaciales,36.85%
Grado en Ingeniería de la Energía,28.35%
Grado en Ingeniería de Sonido e Imagen,35.43%
Grado en Ingeniería Eléctrica,25.32%
Grado en Ingeniería Electrónica Industrial y Automática,32.31%
Grado en Ingeniería en Tecnologías de Telecomunicación,31.86%
Grado en Ingeniería en Tecnologías Industriales,31.87%
Grado en Ingeniería Física,52.98%
Grado en Ingeniería Informática - Leganés,32.87%
Grado en Ingeniería Informática - Colmenarejo,31.88%
Grado en Ingeniería Mecánica,29.61%
Grado en Ingeniería Robótica,31.48%
Grado en Ingeniería Telemática,33.72%
Grado en Matemática Aplicada y Computación,40.72%`;

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
