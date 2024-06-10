import type { PageServerLoad, Actions} from './$types';
import size from '$lib/size';
import { prueba, reservaTaquilla } from '$lib/api_taquillas';


export const load: PageServerLoad = async ({ request }) => {
	const split_url = request.url.split('/').filter((element) => element.length <= 2);
	split_url.shift();
	const edificio = split_url[0];
	const planta = split_url[1][0];
	const fetchOcupacionBloques = async () => {
		const res = await fetch(`http://localhost:18080/api/ocupacionBloque/${edificio}/${planta}`);
		const data = await res.json();
		return data;
	}

	return {
		serverMessage: 'hello from server load function',
        size: size,
		bloques: fetchOcupacionBloques(),
	};
};


export const actions = {
	registerTaquilla: async ({ cookies, request }) => {
		const data = await request.formData();
		const taquilla = data.get('taquilla');
		const nia = data.get('nia');
		const correo = data.get('correo');
		const nombre = data.get('nombre');
		const result = reservaTaquilla(taquilla, nia, correo, nombre);
		return result;
	},
} satisfies Actions;
