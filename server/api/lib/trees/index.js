

const  { generateGeomFromAddress }  =require('./regional_tree_permit');


const run= async () => {

	const place = 'ירושלים';
	const street= 'לפופית';
	
	const location = await generateGeomFromAddress(place, street);
	console.log(`location: ${location}`);
};

run();