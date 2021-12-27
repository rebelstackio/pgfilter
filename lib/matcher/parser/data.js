/* lib/copyTransform/anonymizer/data.js */

// Constants
const FNAMS = [
	'Abigail','Alexandra','Alison','Amanda','Amelia','Amy','Andrea','Angela','Anna','Anne','Audrey','Ava','Bella','Bernadette','Carol','Caroline','Carolyn','Chloe','Claire','Deirdre','Diana','Diane','Donna','Dorothy','Elizabeth','Ella','Emily','Emma','Faith','Felicity','Fiona','Gabrielle','Grace','Hannah','Heather','Irene','Jan','Jane','Jasmine','Jennifer','Jessica','Joan','Joanne','Julia','Karen','Katherine','Kimberly','Kylie','Lauren','Leah','Lillian','Lily','Lisa','Madeleine','Maria','Mary','Megan','Melanie','Michelle','Molly','Natalie','Nicola','Olivia','Penelope','Pippa','Rachel','Rebecca','Rose','Ruth','Sally','Samantha','Sarah','Sonia','Sophie','Stephanie','Sue','Theresa','Tracey','Una','Vanessa','Victoria','Virginia','Wanda','Wendy','Yvonne','Zoe',
	'Adam','Adrian','Alan','Alexander','Andrew','Anthony','Austin','Benjamin','Blake','Boris','Brandon','Brian','Cameron','Carl','Charles','Christian','Christopher','Colin','Connor','Dan','David','Dominic','Dylan','Edward','Eric','Evan','Frank','Gavin','Gordon','Harry','Ian','Isaac','Jack','Jacob','Jake','James','Jason','Joe','John','Jonathan','Joseph','Joshua','Julian','Justin','Keith','Kevin','Leonard','Liam','Lucas','Luke','Matt','Max','Michael','Nathan','Neil','Nicholas','Oliver','Owen','Paul','Peter','Phil','Piers','Richard','Robert','Ryan','Sam','Sean','Sebastian','Simon','Stephen','Steven','Stewart','Thomas','Tim','Trevor','Victor','Warren','William'
];

const LNAMS = [
	'Abraham','Allan','Alsop','Anderson','Arnold','Avery','Bailey','Baker','Ball','Bell','Berry','Black','Blake','Bond','Bower','Brown','Buckland','Burgess','Butler','Cameron','Campbell','Carr','Chapman','Churchill','Clark','Clarkson','Coleman','Cornish','Davidson','Davies','Dickens','Dowd','Duncan','Dyer','Edmunds','Ellison','Ferguson','Fisher','Forsyth','Fraser','Gibson','Gill','Glover','Graham','Grant','Gray','Greene','Hamilton','Hardacre','Harris','Hart','Hemmings','Henderson','Hill','Hodges','Howard','Hudson','Hughes','Hunter','Ince','Jackson','James','Johnston','Jones','Kelly','Kerr','King','Knox','Lambert','Langdon','Lawrence','Lee','Lewis','Lyman','MacDonald','Mackay','Mackenzie','MacLeod','Manning','Marshall','Martin','Mathis','May','McDonald','McLean','McGrath','Metcalfe','Miller','Mills','Mitchell','Morgan','Morrison','Murray','Nash','Newman','Nolan','North','Ogden','Oliver','Paige','Parr','Parsons','Paterson','Payne','Peake','Peters','Piper','Poole','Powell','Pullman','Quinn','Rampling','Randall','Rees','Reid','Roberts','Robertson','Ross','Russell','Rutherford','Sanderson','Scott','Sharp','Short','Simpson','Skinner','Slater','Smith','Springer','Stewart','Sutherland','Taylor','Terry','Thomson','Tucker','Turner','Underwood','Vance','Vaughan','Walker','Wallace','Walsh','Watson','Welch','White','Wilkins','Wilson','Wright','Young',
];

const ADDRS = [
	'Kacap Loop','Bula Path','Bacev Drive','Zatim Street','Doluj Park','Miszi Circle','Fisri Way','Peba Plaza','Tago Street','Dabjon Way','Jena Path','Nezod Street','Guda Plaza','Ascuk Grove','Orro Heights','Cepak Center','Tovab Drive','Wadaki Terrace','Roic Road','Fone Ridge','Miiw Loop','Vafu Parkway','Kilgu Center','Bumo Lane','Ajcev Way','Dalir Park','Laboh Street','Rawbes Street','Watwuj View','Ateol Manor','Lejoh Place','Guowa Court','Palfe Court','Neco Drive','Radti Lane','Jihil Path','Buze Court','Sicmu Key','Juta Glen','Wovbik Drive','Kafa Street','Tedi Street','Doum Court','Diipa Manor','Wopwuc Terrace','Foik Street','Cithaw Court','Ivar Ridge','Gubloh Street','Ehasej Park','Himot Boulevard','Fokwek Street','Olno Street','Naljuj Manor','Cenmi Plaza','Dokig Square','Rezfoz Street','Ojizo Center','Munu Park','Zufgop Street','Julazo Plaza','Wocre Street','Cuok Trail','Lejuv Heights','Vodo View','Isidu Path','Rafa Road','Agerud Grove','Paggof Parkway','Ziabo Grove','Kuid Glen','Arwo Place','Gufov Square','Udorud Road','Gaoso Drive','Icmu Plaza','Neca Heights','Newjeh Street','Udeewe Boulevard','Noge Street','Riram Road','Gaagu Ridge','Otuci Parkway','Tatos Street','Huzoz Park','Gaeh Boulevard','Rodgop Road','Wilzi Heights','Ukfef Street','Roinu Court','Bunne Plaza','Gugodi Road','Bahril Terrace','Wecze Street','Wedih Loop','Ijorel Street','Tuka Road','Mojewa Park','Dotta Drive','Zuci Heights','Afat Street','Pihvag Key','Pumfu Plaza','Ozji Center','Vonik Grove','Bodi Heights','Degofo View','Upba Plaza','Cinot Trail','Ugvop Drive','Lariz Street','Uhko Trail','Kajid Road','Usrin Heights','Gekal Street','Ehapa Street','Hevzov Avenue','Hawgo Path','Davafa Key','Oloso Road','Abveb Way','Akeig Loop','Vosju Parkway','Vane Loop','Dejros Path','Difep Plaza','Maezi Place','Tamku Street','Mebaga Court','Pegseb Loop','Vavi Street','Nobizi Drive','Emaluf Street','Etfe Ridge','Moce Loop','Odbe Street','Ordew Park','Wepoca Avenue','Zaltib Road','Moasu Way','Cenru Street','Ecno Avenue','Tecda Way','Namkag Street','Cuab Lane','Winep Street','Colpow Parkway','Likaz Circle','Hunuc Center','Feagi Boulevard','Fateni Boulevard','Noza Square','Egke Street','Gifi Trail','Ucufaj Square','Wojaz Circle','Lopre Plaza','Oheke Parkway','Oddet Street','Bowa Glen','Lezor Key','Gobov Avenue','Aven Path','Cemo Street','Pegpov Street','Laeno Center','Eremu Circle','Avno Trail','Lufso Street','Wehu Lane','Kutwa Terrace','Meref Glen','Tapwuh Way','Jabit Trail','Irive Street','Raili Parkway','Gifu Street','Fased Ridge','Zokij Street','Gapu Street','Hemih Glen','Vedu Street','Mubeg Key','Pennington Drive','Piddub Boulevard','Sumila Street','Besaj Road','Tetlur Plaza','Voufe Road','Kesda Boulevard','Tefda Place','Ozeoz Glen','Izeas Street','Jomi Center','Wiuki Heights','Aseda Lane','Nadu Glen','Esiiju Heights','Demzet Way','Otera Square','Nudot Path','Panjo Street','Bowe Street','Nilip Manor','Hobed Key','Tisif Court','Ufuni Street','Rewbe Street','Zesa Park','Vezej Ridge','Duus Terrace','Nacol Grove','Kakin Street','Upkil Key','Zocunu Avenue','Oraheg Ridge','Gemfuv Key','Okli Drive','Befu Court','Dosur Key','Orgo Street','Cula Street','Fawu Loop','Butel Boulevard','Riope Street','Ewtuf Boulevard','Lebop Path','Idlij Glen','Ibwal Parkway','Numce Road','Fozci Street','Eceuri Court','Huzduz Street','Hihzo Glen','Hecro Street','Remok Street','Topla Boulevard','Peji Trail','Onupuw Street','Gute Square','Hemu Circle','Sijo Key','Fafe Avenue','Nepbuv Street','Jobos Street','Miar Street','Zicib Street','Sipot Glen','Pihni Circle','Wobbu Key'
];

const COMPS = [
	'Dragbot','Urbanshee','Exodoc','Uniworld','Zillidium','Paprikut','Helixo','Kidstock','Evidends','Zolarity','Quadeebo','Zenthall','Irack','Entogrok','Kyaguru','Norsup','Comfirm','Datacator','Datagene','Noralex','Venoflex','Isosure','Speedbolt','Sybixtex','Malathion','Waterbaby','Maineland','Lyrichord','Nitracyr','Accel','Rugstars','Viasia','Combogene','Comtrail','Scentric','Velity','Schoolio','Ebidco','Baluba','Danja','Quilch','Tetak','Housedown','Medalert','Podunk','Octocore','Krog','Boink','Bristo','Cytrek','Miraclis','Dancity','Equicom','Rodemco','Futurize','Retrotex','Bittor','Genmy','Photobin','Quotezart','Bolax','Zaggle','Proxsoft','Architax','Medicroix','Exostream','Stelaecor','Micronaut','Exovent','Buzzness','Quinex','Zentry','Extremo','Grupoli','Rubadub','Izzby','Exerta','Quintity','Centrexin','Geekus','Hotcakes','Barkarama','Zensure','Rooforia','Manglo','Zytrax','Anivet','Furnafix','Obones','Enquility','Intradisk','Qot','Concility','Isopop','Letpro','Cognicode','Turnling','Kindaloo','Neurocell','Anarco','Zilphur','Undertap','Honotron','Orbaxter','Waterbaby','Zentime','Kidstock','Typhonica','Speedbolt','Rodeology','Ronelon','Slax','Cubix','Zedalis','Medalert','Papricut','Unq','Mantrix','Ozean','Ecrater','Lumbrex','Earbang','Norali','Proxsoft','Nurplex','Geekwagon','Capscreen','Eplode','Fleetmix','Netility','Ohmnet','Applideck','Flotonic','Cipromox','Bleendot','Isologix','Pathways','Newcube','Dancity','Comvey','Calcula','Cyclonica','Electonic','Softmicro','Xeronk','Comvoy','Vertide','Assistix','Acruex','Premiant','Remotion','Talkola','Genmy','Bisba','Pyrami','Bizmatic','Mantro','Combogene','Mediot','Retrotex','Rockyard','Bicol','Ceprene','Tetak','Suretech','Protodyne','Geekola','Spacewax','Rameon','Zboo','Rugstars','Eclipto','Slambda','Polaria','Eyeris','Exerta','Opticon','Accusage','Boilcat','Pharmacon','Micronaut','Entogrok','Klugger','Pulze','Applidec','Zytrek','Magnafone','Stockpost','Sarasonic','Geekfarm','Gorganic','Pearlesex','Sybixtex','Biohab','Sulfax','Cosmosis','Sealoud','Isbol','Ecratic','Aquasseur'
];

const SEED_TYPE = {
	'cseq':0,
	'cuid':1,
	'c_id':2,
	'gseq':3
};

// Internal mappers to keeps references
const LYCUST_SEQ_BY_UNIQUE_ID = new Map();
const LYCUST_SEQ_BY_ID = new Map();
const LYCUST_SEQ_BY_LYGUEST_SEQ = new Map();

const SEED_MAPPER_PER_TYPE = {
	'cseq': null, // Same value
	'cuid': LYCUST_SEQ_BY_UNIQUE_ID,
	'c_id': LYCUST_SEQ_BY_ID,
	'gseq': LYCUST_SEQ_BY_LYGUEST_SEQ
};

// Functions

/**
 * Get the real seed based on the id
 * @param {string} seedtype
 * @param {string} val
 */
const getSeedByMapper = function _getSeedByMapper(seedtype, val){
	const mapper = SEED_MAPPER_PER_TYPE[seedtype];
	if ( mapper ) {
		return parseInt(mapper.get(val));
	} else {
		return parseInt(val);
	}
};

/**
 * Load all the mapper related
 * @param {Array} lycustids Array of triplets [ [ cseq, cuid, c_id, gseq ]]
 */
const loadCache = function _loadCache(lycustids) {
	lycustids.forEach( triplet => {
		LYCUST_SEQ_BY_UNIQUE_ID.set( triplet[1], triplet[0] );
		LYCUST_SEQ_BY_ID.set( triplet[2], triplet[0] );
		LYCUST_SEQ_BY_LYGUEST_SEQ.set ( triplet[3], triplet[0] );
	});
};

/**
 * Load the caches by triplet instead of iterate over all the collection
 * @param {Array} Quadruplet [ seq, uniqueid, id, qseq ]
 */
const loadCacheByQuadruplet = function _loadCacheByQuadruplet([ seq, uniqueid, id, qseq ]) {
	LYCUST_SEQ_BY_UNIQUE_ID.set( uniqueid, seq );
	LYCUST_SEQ_BY_ID.set( id, seq );
	LYCUST_SEQ_BY_LYGUEST_SEQ.set ( qseq, seq );
};

/**
 * Check if a type is part of a seed column
 * @param {string} type
 */
const isSeedType = function _isSeedType( type ){
	return type in SEED_TYPE;
};

const getOffset = function _getOffset( seed, len ) {
	return ( seed + Math.round(seed/len) ) % len;
};

const getFnam = function _getFnam( seed, factor = 1 ) {
	return FNAMS[ getOffset( seed*factor, FNAMS.length ) ];
};

const getLnam = function _getLnam( seed, factor = 1 ) {
	return LNAMS[ getOffset( seed*factor, LNAMS.length ) ];
};

const getComp = function _getComp( seed, factor = 1 ) {
	return COMPS[ getOffset( seed*factor, COMPS.length ) ];
};

const getAddr = function _getAddr( seed, factor = 1 ) {
	return `${( getOffset( seed*1, 999 ) + 10 )} ${ADDRS[ getOffset( seed*factor, ADDRS.length ) ]}`;
};

const getPhon = function _getPhon ( seed, factor = 1 ) {
	return `(${ getOffset( seed*factor, 664) + 112 })${ getOffset( seed*factor, 664) + 112 }-${ getOffset(seed*factor, 8998) + 1001 }`;
};

const getBday = function _getBday ( seed, factor = 1 ) {
	return `${ (new Date()).getFullYear() - ( (seed*factor % 60) + 18 ) }-${ ( getOffset(seed*factor,12)+1 ).toString().padStart(2,'0') }-${ ( getOffset(seed*factor,12)+1 ).toString().padStart(2,'0') }`;
};

const getWsit = function _getWsit ( seed, factor = 1 ) {
	return `${getComp(seed,factor)}.com`;
};

const getFind = function _getFind ( seed, factor = 1 ) {
	return `${(getFnam(seed,factor)).toUpperCase()},${(getLnam(seed,factor)).toUpperCase()}`;
};

const getEmai = function _getEmai ( seed, factor = 1 ) {
	return `${(getFnam(seed,factor)).toLowerCase()}.${(getLnam(seed,factor)).toLowerCase()}@${getComp(seed,factor)}`;
};

const getDigi = function _getDigi ( seed, factor = 1, _digis = 9 ) {
	let digis = _digis && !isNaN(_digis) ? parseInt(_digis): 9;
	return ( getOffset( seed*factor, Math.pow(10,digis-1) ) + Math.pow(10,digis-1) ).toString();
};

const getFnow = function _getFnow(ISO8601DUR, val){
	const date = new Date(val);
	let rx = /^P(?=\d+[YMWD])(?<years>\d+Y)?(?<months>\d+M)?(?<weeks>\d+W)?(?<days>\d+D)?(T(?=\d+[HMS])(?<hours>\d+H)?(?<minutes>\d+M)?(?<seconds>\d+S)?)?$/;
	let matches = ISO8601DUR.match(rx);
	let cd = new Date();
	if ( matches.groups.years )cd = cd.setYear( cd.getFullYear() - parseInt( matches.groups.years.slice(0, matches.groups.years.length - 1) ) );
	if ( matches.groups.months ) cd = cd.setMonth( cd.getMonth() - parseInt( matches.groups.months.slice(0, matches.groups.months.length - 1) ) );
	if ( matches.groups.weeks ) cd = cd.setWeek( cd.getWeek() - parseInt( matches.groups.weeks.slice(0, matches.groups.weeks.length - 1) ) );
	if ( matches.groups.days ) cd = cd.setDate( cd.getDate() - parseInt( matches.groups.days.slice(0, matches.groups.days.length - 1) ) );
	if ( matches.groups.hours ) cd = cd.setHours( cd.getHours() - parseInt( matches.groups.hours.slice(0, matches.groups.hours.length - 1) ) );
	if ( matches.groups.minutes ) cd = cd.setMinutes( cd.getMinutes() - parseInt( matches.groups.minutes.slice(0, matches.groups.minutes.length - 1) ) );
	if ( matches.groups.seconds ) cd = cd.setSeconds( cd.getSeconds() - parseInt( matches.groups.seconds.slice(0, matches.groups.seconds.length - 1) ) );
	if ( date >= cd ) return true;
	else return false;
};

/**
 * Apply the data anon function based on the category
 * @param {string} category
 * @param {number} seed
 * @param {number} factor
 * @param {string} val Current value of the column
 */
const applyDataAnonFn = function _applyDataAnonFn(category, seed, factor = 1, val, rest) {
	switch ( category ) {
	case 'find': return getFind(seed,factor);
	case 'fnam': return getFnam(seed,factor);
	case 'lnam': return getLnam(seed,factor);
	case 'addr': return getAddr(seed,factor);
	case 'phon': return getPhon(seed,factor);
	case 'comp': return getComp(seed,factor);
	case 'emai': return getEmai(seed,factor);
	case 'wsit': return getWsit(seed,factor);
	case 'bday': return getBday(seed,factor);
	case 'digi': return getDigi(seed,factor,rest);
	case 'zlen': return '';
	case 'zlar': return '{}';
	case 'null': return '\\N';
	default:
		if ( !isSeedType(category) ) {
			console.warn(`[PG_RESTORE_FILTER|ANONYMIZING] Category ${category} is not supported`);
		}
		return val;
	}
};

/**
 * Apply the data filter function based on the category
 * @param {string} category fn category
 * @param {number} factor
 * @param {string} val Current value of the column
 */
const applyDataFilterFn = function _applyDataFilterFn(category, factor, val) {
	switch ( category ) {
	case 'fnow': return getFnow(factor,val);
	default:
		console.warn(`[PG_RESTORE_FILTER|FILTERING] Category ${category} is not supported`);
		return val;
	}
};

module.exports = {
	FNAMS,
	LNAMS,
	ADDRS,
	COMPS,
	SEED_TYPE,
	isSeedType,
	getOffset,
	getFnam,
	getLnam,
	getComp,
	getAddr,
	getPhon,
	getBday,
	getWsit,
	getFind,
	getEmai,
	getDigi,
	getFnow,
	applyDataAnonFn,
	applyDataFilterFn,
	loadCache,
	getSeedByMapper,
	loadCacheByQuadruplet
};
