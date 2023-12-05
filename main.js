        testi = document.querySelectorAll('.gs_category');
        testi2 = document.querySelectorAll('.gs_website');
        testi3 = document.querySelectorAll('.gs_kupon');
        testi4 = document.querySelectorAll('.gs_type');

function showallinfo()
{
    for ( p=0; p < testi3.length; p++)
    {
        testi3[ p ].style.display = "";
    }
}

function filtering ( e , a )
{
    //all_vouchers = document.getElementsByClassName('card');
    /*
    var yu = 0;
    testi3.forEach( card =>
        {
            card.style.display = "flex";
            console.log( yu );
            yu++;
        }
    );
    */

    searchcompany = document.getElementsByClassName( 'sort_by_company' )[0].selectedOptions[0].innerText ;
    searchtype = document.getElementsByClassName( 'sort_by_type' )[0].selectedOptions[0].innerText ;
    searchcategory = document.getElementsByClassName( 'sort_by_category' )[0].selectedOptions[0].innerText ;
    //console.log( a );

    companies_all = document.getElementsByClassName( 'sort_by_company' )[0].options[0].label ;
    types_all = document.getElementsByClassName( 'sort_by_type' )[0].options[0].label ;
    categories_all = document.getElementsByClassName( 'sort_by_category' )[0].options[0].label ;

    document.getElementsByClassName( 'sort_by_type' )[0].options[0].label

    for ( p=0; p < testi3.length; p++)
    {
        if ( ( testi3[ p ].children[3].innerText != searchcategory && searchcategory != categories_all ) && ( testi3[ p ].children[2].innerText != searchcompany && searchcompany !=  companies_all ) && ( testi3[ p ].children[6].innerText != searchtype && types_all != searchtype ) )
            testi3[ p ].style.display = "none" ;
        else
            testi3[ p ].style.display = "" ;
    }

window.onload = function()
        {
            document.getElementById("loading").style.display = "none";
            document.getElementById("sort").style.display = "block";

            companies = document.getElementsByClassName ("gs_website");
            allcompanies = [];
            for ( i = 0 ; i < companies.length ; i++ )
            {
                if ( allcompanies.includes (companies[i].innerHTML ) == false )
                    allcompanies.push (companies[i].innerHTML);
            }

            types = document.getElementsByClassName ("gs_type");
            alltypes = [];
            for ( i = 0 ; i < types.length ; i++ )
            {
                if ( alltypes.includes (types[i].innerHTML ) == false )
                    alltypes.push (types[i].innerHTML);
            }


            categories = document.getElementsByClassName ("gs_category");
            allcategories = [];
            for ( i = 0 ; i < categories.length ; i++ )
            {
                if ( allcategories.includes (categories[i].innerHTML ) == false )
                    allcategories.push (categories[i].innerHTML);
            }

            allcategories.sort();
            alltypes.sort();
            allcompanies.sort();



	categoryselect = '<div><span>Сортировка по категории</span>		    <select id="categories" name="categories" method="post" class="sort_by_category" onchange="filtering( this , this.className )">				<option value="pusto" class="filter_action">				Все категории				</option><option value="pusto" class="filter_action">' + allcategories.join ('<option class="filter_action">') + '</option>' +
            '</select></div>';


	companyselect =	'<div><span>Сортировка по категории</span>        <select id="companies" name="categories" method="post" class="sort_by_company" onchange="filtering( this , this.className)"><option value="pusto" class="filter_action">				Все компании				</option><option value="pusto" class="filter_action">' + allcompanies.join ('<option value="pusto" class="filter_action">') + '        </option>        </select>	</div>';

	typeselect =	'<div><span>Сортировка по типу скидки</span>		    <select id="types" name="categories" method="post" class="sort_by_type" onchange="filtering( this , this.className )"><option value="pusto" class="filter_action">				Все типы  скидок				</option><option value="pusto" class="filter_action">'  + alltypes.join ('<option class="filter_action">') +		    '</option></select>	</div><div id="buttondiv"><button id="buttonshowall" onclick="showallinfo">Сбросить / Показать всё</button></div>';

    filter = document.getElementById('sort');
    filter.innerHTML = companyselect + categoryselect + typeselect;
    }
