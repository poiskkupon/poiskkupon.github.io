d=document.getElementById('Select') ;
d.onchange=function( )
{
	if ( document.getElementById('Select2') != undefined ) document.getElementById('Select2').remove() ;

	d=document.getElementById('Select') ;
	sel_id = d.selectedOptions[0].value;
	kol = document.getElementById('categs') ;

	na = 0;
	kk = 1;

var newselect = document.createElement("select");
newselect.id = 'Select2';
newselect.onchange = 'newselection()';
kol.appendChild( newselect );	
	
var newoptio = document.createElement("option");
newoptio.text = 'Все подкатегории';
newoptio.value = 'allsubcategories';
newoptio.id = 'menu_idall';
document.getElementById('Select2').appendChild( newoptio );
	

	
for (const [key, value] of Object.entries(titelliste)) {

	{
		if ( titelliste[ kk ] == undefined ) { kk++; continue; }

		foo = titelliste[ kk ];
		if ( foo.parent_id == sel_id )
		{
			na++;
			// if ( na == 0 )
			// {
			// 	na++;
			// 	var newselect = document.createElement("select");
			// 	newselect.id = 'Select' + (na+1);
			// 	newselect.onchange = 'newselection()';

			// 	kol.appendChild( newselect );
			// }
			var newoption = document.createElement("option");

			newoption.text = foo.name;
			newoption.value = foo._id;
			newoption.id = 'menu_id' + foo._id;
			document.getElementById('Select2').appendChild( newoption );

		}
		kk++;
	}


}


}

window.onload = moreload();

function moreload () {

	jsoni = catlist;

titelliste = JSON.parse(jsoni , true) ;

i = 0;
l = 1;
categ1 = [];
categnum1 = [];
while ( l < Object.keys(titelliste).length  )
{
	if ( titelliste[l] == undefined ) { l++; continue;}
	if ( titelliste[l].parent_id != undefined ) { l++; continue;}
	if ( titelliste[l] == undefined ) { l++; continue;}
	num = titelliste[l].name.trim();
	categ1[ i ] = num ;
	categnum1 [ titelliste[l].name.trim() ] = titelliste[l]._id;
	i++;
	l++;
}

categ1.sort();

// add все категории
	
var selectt = document.getElementById("Select");
var optionn = document.createElement("option");
optionn.text = 'Все категории' ; //titelliste[k].name;
optionn.value = 'vse'; //titelliste[k]._id;
optionn.id = 'menu_idvse'; //titelliste[k]._id;
optionn.addEventListener('click', function handleClick(event) 
{ 
	//console.log('element clicked 🎉🎉🎉', event.target.id);
});
selectt.appendChild( optionn );




	
	for ( k = 0 ; k < categ1.length ; k++ )
	{
	    	var select = document.getElementById("Select");
	    	var option = document.createElement("option");
		option.text = categ1[ k ] ; //titelliste[k].name;
	    	option.value = categnum1[ categ1[ k ] ]; //titelliste[k]._id;
	    	option.id = 'menu_id' + categnum1[ categ1[ k ] ]; //titelliste[k]._id;
		option.addEventListener('click', function handleClick(event) {
	  		//console.log('element clicked 🎉🎉🎉', event.target.id);
		});
		select.appendChild( option );
	}
}



async function loadXMLDoc(dname)
{
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			xhttp.open("GET",dname,false);
			xhttp.send();
			return xhttp.responseXML;
		};
		xhttp.open("GET", dname);
    }
    else
    {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",dname,false);
    xhttp.send();
	console.log (xhttp.responseXML);
    return xhttp.responseXML;
}


function toggleShow () {
  var el = document.getElementById("box");
  el.classList.toggle("show");
}


async function searchXML( page=9999)
{
	cd = 'Jm9yZGVyPXByaWNlJl9nc19hdD0wOTU2MWYxYWM0NWZiNGIxYmI4ZGIzMzNjNDk4MTgxYjI1NjFiZTk5J';
	searchpage = 30;
	document.getElementById('pagination').innerHTML = '';
	document.getElementById('results').innerHTML = '';

    var twoToneButton = document.querySelector('.startbutton') ;
    twoToneButton.innerHTML = 'Ищем...';

	loading = document.createElement( 'div' );
	loading.innerHTML = '<div class="progress"><div class="color"></div></div>';

	if ( document.getElementById('aliexpress').checked  == false ) {shopoff = 'no_m=101124,82012';} else shopoff='';
	if ( ( document.getElementById('notid').checked  == true ) + ( document.getElementById('nobooks').checked ) > 0 ) {notid='&no_tid=';} else notid='';
	
	if ( document.getElementById('notid').checked  == true )
	{
		accsoff = '2,3,59,63,64,107,108,110,120,150,159,249,473,481,525,535,571,685,687,689,691,693,695,697,699,717,721,727,729,733,739,743,749,751,753,755,757,759,761,763,765,769,771,773,775,777,779,781,783,785,799,801,803,813,815,817,863,887,889,891,911,913,915,917,919,921,923,925,927,957,997,1078,1086,1660,1661,1662,1666,1667,1668,1675,1679,1680,1681,1682,1690,1694,1695,1696,1708,1712,1716,1717,1725,1735,1736,1752,1753,1768,1772,1773,1781,1791,1792,1808,1809,1826,1827,1835,1840,1849,1850,1851,1852,1853,1854,1855,1856,1857,1858,1859,1860,1861,1862,1863,1864,1865,1866,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1892,1893,1894,1895,1896,1897,1898,1899,1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994';
	}
	else
		accsoff='';

	if ( document.getElementById('nobooks').checked  == true )
	{
		if ( accsoff == '' )
			bookoff = '121,123,128,629,655,1105,1984';
		else
			bookoff = ',121,123,128,629,655,1105,1984';
	}
	else
		bookoff='';

	if ( document.getElementById("input").value.replace(/ /g," AND ") == '' )
	{
		alert('Введите слово для поиска') ;
		twoToneButton.innerHTML = 'Нажмите для поиска';
		return;
	}

	if ( document.getElementById('Select2') == null )
	{
		alert('viberite categoriu') ;
		twoToneButton.innerHTML = 'Нажмите для поиска';
		return;
	}


	if ( document.getElementById('Select2').selectedOptions[0] != undefined && document.getElementById('Select2').selectedOptions[0].value != 'allsubcategories' )
	{
		console.log ('allsubcategories')
		tid = '&tid=' + document.getElementById('Select2').selectedOptions[0].value ;
		searchpage = 10;
	}
	else
		if ( document.getElementById('Select').selectedOptions[0].value != 'vse'  )
		{
			tid = '&tid=' + document.getElementById('Select').selectedOptions[0].value;
			searchpage = 10;
		}
		else
			tid = '';

	console.log ( 'tid = ' + tid );

	// if (document.getElementById('Select2').selectedOptions[0].value == 'allsubcategories')
	// 	tid = '&tid=' + document.getElementById('Select2').selectedOptions[0].value ;

	console.log(tid);

	if ( page != 9999 )
	{

		setTimeout(function() {
			//your code to be executed after 1 second
		}, 400);


		lastsearch = "https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&p=" + page + atob(cd + 'g')  + shopoff + notid + accsoff + bookoff + tid ;
		twoToneButton.innerHTML = 'Ищем... ' + p ;
		//console.log (p);
		//console.log ( lastsearch );

		await (jQuery.ajax({
		type: "GET",
		url: "https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&p=" + page + atob(cd + 'g')  + shopoff + notid + accsoff + bookoff + tid
		}).done( function( mydata ){
		xmlDocAlt = mydata;
		}) );



		xAlt = xmlDocAlt.getElementsByTagName("offer");
		minPrice.push ( xAlt[(xmlDocAlt.getElementsByTagName("offer").length - 1)].children[0].textContent );
		pages.push(page);
		//console.log ( 'searchpage-page=' + (searchpage - page));
	}

	else
	{
		document.getElementById('results').innerHTML = '';
		document.getElementById('pagination').innerHTML = '';

		searchquery = encodeURIComponent(document.getElementById("input").value.trim().replace(/ /g," AND "));
		if ( searchquery == lastsearchquery ) {alert ('Введите новые слова для поиска'); return;}

		var lastsearchquery = searchquery;

		pages = [];
		minPrice = [];

		mysearch = "https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&order=price&_gs_at=09561f1ac45fb4b1bb8db333c498181b2561be99&" + shopoff + notid + accsoff + bookoff + tid;

		if ( page != 9999 )
		{
			var showingpagenum = page;
		}



		for ( p = searchpage + 1 ; p > 0 ; p--  )
		{
			lastsearch = "https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&p=" + p + atob(cd + 'g')  + shopoff + notid + accsoff + bookoff + tid ;
			twoToneButton.innerHTML = 'Ищем... ' + p ;
			console.log (page);


			//console.log ( lastsearch );
			await (jQuery.ajax({
			type: "GET",
			url: "https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&p=" + p + atob(cd + 'g')  + shopoff + notid + accsoff + bookoff + tid
			}).done( function( mydata ){
			//console.log( mydata );
			xmlDocAlt = mydata;
			}) );

			try {xmlDocAlt.getElementsByTagName("offer"); }
			catch
			{
				continue;
			}
			if ( xmlDocAlt.getElementsByTagName("offer").length == 0 ) continue;
			else
			{
				maxpage = p ;
				break;
			}

			//console.log(p);
			xAlt = xmlDocAlt.getElementsByTagName("offer");
			minPrice.push ( xAlt[(xmlDocAlt.getElementsByTagName("offer").length - 1)].children[0].textContent );
			pages.push(p);

			if ( showingpagenum == p ) break;
		}

	}
	//console.log('test');
	
	if (typeof maxpage == 'undefined') {
				var mag = document.createElement("div");
				mag.innerHTML = '<h2 id="shop-name" text-align="center">Ничего не найдено. Введите другие слова для поиска.</h2>';
				//element.appendChild(document.createTextNode(divText));
				document.getElementById('results').appendChild(mag);
				return;
				throw new Error();	
	}
	
	
	pageList = [];
	for ( o = 1 ; o < maxpage ; o++)
	{
		pageList.push (o);
		
		var el = document.createElement("div");
		el. className = 'pagenumber';		
		el.innerHTML = '<a class="xmlList" onclick="searchXML(' + ( maxpage - o ) +')" text-align="center">' + o +  '</a>';
		document.getElementById('pagination').appendChild(el);
	}

	xmlDoc = xmlDocAlt;
	
	x=xmlDoc.getElementsByTagName("offer");
	magazin = xmlDoc.getElementsByTagName("name")[0].childNodes[0].data;
	
				var mag = document.createElement("div");

				if ( page == 9999 )
					mag.innerHTML = '<h2 id="shop-name" text-align="center">Найдено более ' + ( ( maxpage-2 )* 100) + ' товаров. Страница 1 . Показано: '+ x.length + '</h2>';
				else
					mag.innerHTML = '<h2 id="shop-name" text-align="center">Найдено более ' + ( ( maxpage-2 )* 100) + ' товаров. Страница ' + ( pageList.length - page + 1) + ' . Показано: '+ x.length + '</h2>';
				//mag.className = 'niz_pagination';
				document.getElementById('results').appendChild(mag);

				var mag = document.createElement("div");
				mag.innerHTML = '<div id="mainbox" class="products columns-3"></ul>';
				document.getElementById('results').appendChild(mag);
	
    input = document.getElementById("input").value;
    size = input.length;
    if (input == null || input == "")
    {
        document.getElementById("results").innerHTML = "Введите слово для поиска";
        return false;
    }
    for (i = x.length - 1; i >= 0; i--)
		
    {
		for ( j = 0 ; j < ( xmlDoc.getElementsByTagName("offer")[i].children.length ); j++) 
		{
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'name' ) {name = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'price' ) {
			price = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; 
			if (i == 0) pricemax = price;
			if (i == x.length - 1) pricemin = price;
		}
		
		
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'destination-url-do-not-send-traffic' ) {
			shopname = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent.slice(xmlDoc.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 3)+2,xmlDoc.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 10)) ; 
			origurl = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent;
		}

		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'oldprice' ) {oldprice = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'thumbnail' ) {thumbnail = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'url' ) {url = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'picture' ) {picture = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'description' ) {description = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }


		
		if ( j == xmlDoc.getElementsByTagName("offer")[i].children.length - 1 ) {
			if ( oldprice != 0 ) skidka = 'skidochka'; else {skidka ='bez skidki'; oldprice = price;}
			shopname = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent.slice(xmlDoc.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 3)+2,xmlDoc.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 10)) ; 
			
			//divText = '<a href="' + url + '" class="woocommerce-LoopProduct-link woocommerce-loop-product__link" target="_blank"><h3>' + shopname +'</h3><img loading="lazy" src="' + picture  + '"' + 	' alt="Изображение временно отсутствует" class="woocommerce-placeholder wp-post-image" width="241" height="241"><button id="thisimage' + j + '" onclick="reloadimage( this. id)">Обновить картинку</button><h2 class="woocommerce-loop-product__title">' + name + '</h2><span class="onsale">Скидка ' + (oldprice - price).toFixed() + ' руб</span><span class="price"><del aria-hidden="true"><span class="woocommerce-Price-amount amount">' + oldprice + '</span></del><ins><span class="woocommerce-Price-amount amount"><bdi>'+ price +'<span class="woocommerce-Price-currencySymbol">₽</span></bdi></span>	</ins></span></a><a href="' + url + '" class="button product_type_simple add_to_cart_button ajax_add_to_cart"  rel="nofollow">Посмотреть</a>';
			divText = '<a class="woocommerce-LoopProduct-link woocommerce-loop-product__link" target="_blank"><h3>' + shopname +'</h3><img loading="lazy" src="' + picture  + '"' + 	' alt="Изображение временно отсутствует" class="woocommerce-placeholder wp-post-image" width="241" height="241"><button id="thisimage' + j + '" onclick="reloadimage( this. id)">Обновить картинку</button><h2 class="woocommerce-loop-product__title">' + name + '</h2><span class="onsale">Скидка ' + (oldprice - price).toFixed() + ' руб</span><span class="price"><del aria-hidden="true"><span class="oldprice">' + oldprice + '</span></del><ins><span class="price"><bdi>'+ price +'<span class="woocommerce-Price-currencySymbol">₽</span></bdi></span>	</ins></span></a><a href="' + url + '" target="_blank" class="linktoshop"  rel="nofollow">Посмотреть</a>';

			
		}
	
		}
		dd = document.createElement("div");

		dd.innerHTML = divText;
		//dd.className = 'niz_pagination';
		document.getElementById('mainbox').appendChild(dd);
		// dd.id = 'ttt';
		dd.className = 'card';

    }
				var magj = document.createElement("div");
				//magj.classList = 'pagination';
				
				magj.innerHTML = '<h2 id="shop-name-down" text-align="center">Найдено более ' + ( maxpage - 2) * 100  + ' товаров. Страница ' + ( pageList.length - page ) + ' . Показано: '+ x.length + '</h2>';
				document.getElementById('results').appendChild(magj);
				
				document.getElementById('shop-name').innerHTML = document.getElementById('shop-name').innerHTML + '. Цены от ' + pricemin + ' до ' + pricemax ;

				
				document.getElementById('results').appendChild(magj);
				document.getElementById('shop-name-down').innerHTML = document.getElementById('shop-name').innerHTML;

				var nizpagination = document.createElement("div");
					nizpagination.innerHTML = document.getElementById('pagination').innerHTML;
					nizpagination.classList = 'niz_pagination';
					document.getElementById('results').appendChild(nizpagination);

	twoToneButton.innerHTML = 'Нажмите для поиска';
	//console.log( ' konec ');

}


//admitad
function loadXMLDoca(dname)
{
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
    }
    else
    {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",dname,false);
    xhttp.send();
    return xhttp.responseXML;
}
function searchXMLa()
{
	document.getElementById('results').innerHTML = '';

    xmlDoc=loadXMLDoc("https://ccc.ru/%D0%AE%D0%9D%D0%98%D0%97%D0%9E%D0%9E.xml");
    
	
	x=xmlDoc.getElementsByTagName("offer");
	magazin = xmlDoc.getElementsByTagName("name")[0].childNodes[0].data;
	shopname = magazin;
	
				var mag = document.createElement("div");
				mag.innerHTML = '<h2 id="shop-name" text-align="center">' + magazin + '</h2>';
				//element.appendChild(document.createTextNode(divText));
				document.getElementById('results').appendChild(mag);
	
    input = document.getElementById("input").value;
    size = input.length;
	var ii = 0;
    if (input == null || input == "")
    {
        document.getElementById("results").innerHTML = "Введите слово для поиска";
        return false;
    }
    for (i=0; i<x.length; i++)
    {
		
		for (j=0 ; j < xmlDoc.getElementsByTagName("offer")[i].children.length ; j++) 
		{
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'name' ) {name = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ;}
		
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'price' ) {price = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }

		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'oldprice' ) {oldprice = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'picture' ) {picture = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'url' ) {url = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'picture' ) {picture = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlDoc.getElementsByTagName("offer")[i].children[j].localName == 'description' ) {description = xmlDoc.getElementsByTagName("offer")[i].children[j].textContent ; }

	
		}

	if ( name.indexOf(input) == -1 ) {continue;} else {ii++;}
		divText = '<h3>' + ii + '.</h3>' + '<a>' +' '+ shopname + '</a><a target="_blank" href="'  + '">' + name + '</a>' + '<a class="sorto' + '' +'">' + price + '</a>'+ '<img width="250em" alt="" loading="lazy" src="' + picture + '">'+ '<a>' + /*description + */'</a><a>' +  '</a><hr>'  ;
		
		
		dd = document.createElement("div");

		dd.innerHTML = divText;
		document.getElementById('results').appendChild(dd);			
		// dd.id = 'ttt';
    }

}

function showPage(pageNum) 
	{
		naideno = document.getElementById('shop-name').innerHTML;
		pagesAll = document.getElementsByClassName('xmlList').length;
		document.getElementById('results').innerHTML ='';
		p = pagesAll/2 - pageNum;
		console.log(p);
		//если p = 0 то выдаёт последнюю страницу
		xmlD = loadXMLDoc("https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&p=" + (p + 1) + "&order=price&_gs_at=09561f1ac45fb4b1bb8db333c498181b2561be99&" + shopoff + notid + accsoff + bookoff );

		//
		
		x=xmlD.getElementsByTagName("offer");
		magazin = xmlD.getElementsByTagName("name")[0].childNodes[0].data;
	
				var mag = document.createElement("div");
				mag.innerHTML = '<h2 id="shop-name" text-align="center">' +  ( naideno.slice(0, naideno.indexOf('Страница')) ) + 'Страница ' + pageNum + '. Показано ' + x.length + '</h2>';
				//mag.innerHTML = '<h2 id="shop-name" text-align="center">' +  ( naideno.slice(0, naideno.indexOf('Показано')) ) + 'Показано ' + x.length +  '</h2>';
				//element.appendChild(document.createTextNode(divText));
				document.getElementById('results').appendChild(mag);


				//создаём список товаров				
				var mag = document.createElement("div");
				mag.innerHTML = '<div id="mainbox" class="products columns-3"></ul>';
				//element.appendChild(document.createTextNode(divText));
				document.getElementById('results').appendChild(mag);
	
    input = document.getElementById("input").value;
    size = input.length;
    if (input == null || input == "")
    {
        document.getElementById("results").innerHTML = "Введите слово для поиска";
        return false;
    }
//    for (i=0; i<x.length; i++)
    for (i = x.length - 1; i >= 0; i--)
		
    {
		//fname = xmlDoc.getElementsByTagName("offer")[i].children[1].innerHTML;
		//fname = xmlDoc.getElementsByTagName("name")[i].childNodes[0].nodeValue;
		//xmlDoc.getElementsByTagName("offer")[1].children
		
		for ( j = 0 ; j < ( xmlD.getElementsByTagName("offer")[i].children.length  ) ; j++) 
		{
		console.log (i + ' ' + j);
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'name' ) {name = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'price' ) {
			price = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; 
			if (i == 0) pricemax = price;
			if (i == x.length - 1) pricemin = price;
		}
		
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'destination-url-do-not-send-traffic' ) {
			shopname = xmlD.getElementsByTagName("offer")[i].children[j].textContent.slice(xmlD.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 3)+2,xmlD.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 10)) ; 
			origurl = xmlD.getElementsByTagName("offer")[i].children[j].textContent;
		}

		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'oldprice' ) {oldprice = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'thumbnail' ) {thumbnail = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'url' ) {url = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'picture' ) {picture = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; }
		if (xmlD.getElementsByTagName("offer")[i].children[j].localName == 'description' ) {description = xmlD.getElementsByTagName("offer")[i].children[j].textContent ; }


		
		if ( j == xmlD.getElementsByTagName("offer")[i].children.length - 1 )
		{
			if ( oldprice != 0 ) skidka = 'skidochka'; else {skidka ='bez skidki'; oldprice = price;}
			shopname = xmlD.getElementsByTagName("offer")[i].children[j].textContent.slice(xmlD.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 3)+2,xmlD.getElementsByTagName("offer")[i].children[j].textContent.indexOf('/' , 10)) ; 
			
			divText = '<a class="woocommerce-LoopProduct-link woocommerce-loop-product__link" target="_blank"><h3>' + shopname +'</h3><img loading="lazy" src="' + picture  + '"' + 	' alt="Изображение временно отсутствует" class="woocommerce-placeholder wp-post-image" width="241" height="241"><button id="thisimage' + j + '" onclick="reloadimage( this. id)">Обновить картинку</button><h2 class="woocommerce-loop-product__title">' + name + '</h2><span class="onsale">Скидка ' + (oldprice - price).toFixed() + ' руб</span><span class="price"><del aria-hidden="true"><span class="oldprice">' + oldprice + '</span></del><ins><span class="price"><bdi>'+ price +'<span class="woocommerce-Price-currencySymbol">₽</span></bdi></span>	</ins></span></a><a href="' + url + '" target="_blank" class="linktoshop"  rel="nofollow">Посмотреть</a>';
		}
	
	}
		

		
		
		
		
		
		dd = document.createElement("div");

		dd.innerHTML = divText;
		document.getElementById('mainbox').appendChild(dd);
		// dd.id = 'ttt';
		dd.className = 'product type-product post-49663 status-publish  instock product_cat-25475 product_tag-hobby-bike product_tag-24848 product_tag--hobby-bike product_tag-25477 product_tag-6514 sale shipping-taxable purchasable product-type-simple';
		console.log(i);
	}
	
				
				document.getElementById('shop-name').innerHTML = document.getElementById('shop-name').innerHTML + '. Цены от ' + pricemin + ' до ' + pricemax ;

				
				console.log ( "https://api.gdeslon.ru/api/search.xml?q=" + searchquery + "&l=100&p=" + p + "&order=price&_gs_at=09561f1ac45fb4b1bb8db333c498181b2561be99&" + shopoff + accsoff ) ;
	
				var magj = document.createElement("div");
				magj.innerHTML = document.getElementById('shop-name').innerHTML;
				document.getElementById('results').appendChild(magj);

				var nizpagination = document.createElement("div");
				nizpagination.innerHTML = document.getElementById('pagination').innerHTML;
				document.getElementById('results').appendChild(nizpagination);


				//console.log( ' konec showpage');

}



window.onload = function() {
if ( decodeURI(document.URL).indexOf('#') != -1 ) 
	{ document.getElementById('input').value = decodeURI(document.URL).slice(decodeURI(document.URL).indexOf('#')+1,decodeURI(document.URL).indexOf('#')+40); searchXML();  }
}
