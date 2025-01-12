// async function getcoupons ()
// {
//     jQuery.get( 'data/coupon_string' , function(data) {
//         xmlstr = data
//     });
// }

//xmlstr =  getcoupons ()
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}


function search_coupons()
{

    // search
    //


    chosen_category = document.querySelector("#categories").selectedIndex ;
    chosen_merchant = document.querySelector("#merchants").selectedIndex ;

    chosen_category_value = document.querySelector("#categories").selectedOptions[0].innerText  ;
    chosen_merchant_value = document.querySelector("#merchants").selectedOptions[0].innerText ;



    showed_categories = [];
    showed_merchants = [];
    obj = JSON.parse(xmlstr);

    query = document.getElementsByClassName('input-box')[0].children[0].value.toLowerCase();

    // clear screen


    if ( document.getElementById('promok').checked == true )
        promokod = true;
    else
        promokod = false;

    document.getElementById('mainbox').innerHtml='';


    // add info searched
    mainboxhtml = '';
    for ( i = 0; i< obj.length; i++ )
    {


        showed_merchants.push ( obj[i].merchantname );
        showed_categories.push ( obj[i].couponcategory );


        if (obj[i].code != '')
            pr_code = obj[i].code;
        else
            pr_code = 'Не требуется';

        if ( promokod == true && obj[i].code == '' )
            continue;

        if ( chosen_category != "0" && obj[i].couponcategory != chosen_category_value )
        {
            console.log (chosen_category_value);
            console.log (obj[i].couponcategory);
            continue;
        };

        if ( chosen_merchant != "0" && obj[i].merchantname != chosen_merchant_value )
{
            continue;
}
            if ( promokod == true && obj[i].code != '' )
            {

                if ( obj[i].description.toLowerCase().includes(query) || obj[i].instruction.toLowerCase().includes(query) || obj[i].kind.toLowerCase().includes(query) ||  obj[i].name.toLowerCase().includes(query) ||obj[i].merchantname.toLowerCase().includes(query) || obj[i].tagging_ads.toLowerCase().includes(query) )
                {
                    //console.log (obj[i]);
                    //console.log (obj[i].description);
                    //console.log ( obj[i].regions )
                    //console.log ( obj[i].frameset_link )
                    //console.log ( obj[i].url );
                    //console.log ( obj[i].code );
                    //showed_merchants.push ( obj[i].merchantname );
                    //showed_categories.push ( obj[i].couponcategory );
                    //merchantid = obj[i].tagging_ads;
                    mainboxhtml = mainboxhtml + '<div class="card"><img src="' + obj[i].logo + '" alt="" /><h1><a href="' + obj[i].url + '">' + obj[i].merchantname + '</a></h1><p>' + obj[i].description + '</p><p class="tag_ad">' + obj[i].tagging_ads + '</p><p class="code">' + pr_code + '</p></div>';
                }
            }
            else
            {
                if ( obj[i].description.toLowerCase().includes(query) || obj[i].instruction.toLowerCase().includes(query) || obj[i].kind.toLowerCase().includes(query) ||  obj[i].name.toLowerCase().includes(query) ||obj[i].merchantname.toLowerCase().includes(query) || obj[i].tagging_ads.toLowerCase().includes(query) )
                {
                    //console.log (obj[i]);
                    //console.log (obj[i].description);
                    //console.log ( obj[i].regions )
                    //console.log ( obj[i].frameset_link )
                    //console.log ( obj[i].url );
                    //merchantid = obj[i].tagging_ads;
                    //console.log ( obj[i].code );
                    //showed_merchants.push ( obj[i].merchantname );
                    //showed_categories.push ( obj[i].couponcategory );

                    mainboxhtml = mainboxhtml + '<div class="card"><img src="' + obj[i].logo + '" alt="" /><h1><a href="' + obj[i].url + '">' + obj[i].merchantname + '</a></h1><p>' + obj[i].description + '</p><p class="tag_ad">' + obj[i].tagging_ads + '</p><p class="code">Промокод: ' + pr_code + '</p></div>';
                }

            }
        //     else mi=1;
        // else
        // {
        //     console.log ( obj[i].short_name.toLowerCase() );
        //     console.log ( query );
        // }
    }

    // usage example:

    //console.log (showed_merchants);


    showed_merchants = showed_merchants.filter(onlyUnique);
    showed_categories = showed_categories.filter(onlyUnique);
    showed_categories.sort();
    showed_merchants.sort();


merchantshtml = '';
for ( j = 0 ; j < showed_merchants.length; j++)
{
    //console.log (showed_merchants[j]);
    merchantshtml = merchantshtml + '<option value="' + showed_merchants[j] + '">' + showed_merchants[j] + '</option>';
}

categorieshtml = '';
for ( k = 0 ; k < showed_categories.length; k++)
{
    //console.log (showed_categories[k]);

    categorieshtml = categorieshtml + '<option value="' + showed_merchants[j] + '">' + showed_categories[k] + '</option>';
}
categorieshtml = '<option value="all">Все категории</option>' + categorieshtml ;
merchantshtml = '<option value="all">Все магазины</option>' + merchantshtml ;


document.getElementById('mainbox').innerHTML = mainboxhtml;
document.getElementById('categories').innerHTML = categorieshtml;
document.getElementById('merchants').innerHTML = merchantshtml;

if ( categorieshtml != '<option value="all">Все</option>')
    document.querySelector(".additional_categories").style.display = '';
else
    document.querySelector(".additional_categories").style.display = 'none';

if ( merchantshtml != '<option value="all">Все</option>')
    document.querySelector(".additional_merchants").style.display = ''
else
    document.querySelector(".additional_merchants").style.display = 'none';

document.getElementById("categories").selectedIndex = chosen_category;
document.getElementById("merchants").selectedIndex = chosen_merchant;
}
